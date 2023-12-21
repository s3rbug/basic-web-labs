import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import sqlite3, { Database } from "sqlite3";

function createDatabaseConnection(name: string): Database {
	return new (sqlite3.verbose().Database)(name);
}

async function prepareDatabase(database: Database) {
	database.run(`
        CREATE TABLE IF NOT EXISTS Users (
            name TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            "group" TEXT,
            variant INTEGER,
            phone TEXT
        );
    `);
	await createHardcodedUsers(database);
}

async function createHardcodedUsers(db: Database) {
	const hardcodedUsers = [
		{
			name: "user",
			password: await bcrypt.hash("password", 10),
			role: "user",
			group: "exampleGroup1",
			variant: 1,
			phone: "123456789",
		},
		{
			name: "admin",
			password: await bcrypt.hash("password", 10),
			role: "admin",
			group: "exampleGroup2",
			variant: 2,
			phone: "987654321",
		},
	];

	const existingUsers = await new Promise<string[]>((resolve, reject) => {
		db.all("SELECT name FROM Users", (err, rows: User[]) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows.map((row) => row.name));
			}
		});
	});

	hardcodedUsers.forEach(async (user) => {
		if (!existingUsers.includes(user.name)) {
			db.run(
				'INSERT INTO Users (name, password, role, "group", variant, phone) VALUES (?, ?, ?, ?, ?, ?)',
				[
					user.name,
					user.password,
					user.role,
					user.group,
					user.variant,
					user.phone,
				],
				(err) => {
					if (err) {
						console.error(err);
					} else {
						console.log(`User '${user.name}' created`);
					}
				}
			);
		} else {
			console.log(
				`User '${user.name}' already exists, skipping creation`
			);
		}
	});
}

const db = createDatabaseConnection(process.env.DB_NAME ?? "./database.db");
prepareDatabase(db);

type UserRole = "admin" | "user";

type User = {
	name: string;
	password: string;
	role: UserRole;
	group?: string;
	variant?: string;
	phone?: string;
};

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req: Request, res: Response) => {
	const { ACCESS_TOKEN_SECRET } = process.env;
	if (!ACCESS_TOKEN_SECRET) {
		return res.status(500).send({ message: "Server error" });
	}

	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user: User = {
			name: req.body.name,
			password: hashedPassword,
			role: req.body.role,
			group: req.body?.group,
			variant: req.body?.variant,
			phone: req.body?.phone,
		};

		// Insert user into the SQLite database
		db.run(
			"INSERT INTO Users (name, password, role) VALUES (?, ?, ?)",
			[user.name, user.password, user.role],
			(err) => {
				if (err) {
					console.error(err);
					return res
						.status(500)
						.send({ message: "Error creating user" });
				}

				const accessToken = generateToken(user, ACCESS_TOKEN_SECRET);

				res.status(201).send({
					message: `User '${user.name}' created`,
					accessToken,
					role: user.role,
				});
			}
		);
	} catch {
		res.status(500).send();
	}
});

app.post("/login", async (req: Request, res: Response) => {
	const { ACCESS_TOKEN_SECRET } = process.env;
	if (!ACCESS_TOKEN_SECRET) {
		return res.status(500).send({ message: "Server error" });
	}
	const username = req.body.name;
	const password = req.body.password;

	// Retrieve user from the SQLite database
	db.get(
		"SELECT * FROM Users WHERE name = ?",
		[username],
		async (err, userRow: User) => {
			if (err) {
				console.error(err);
				return res.status(500).send({ message: "Server error" });
			}

			if (!userRow) {
				return res.status(400).send({ message: "Cannot find user" });
			}

			const user: User = {
				name: userRow.name,
				password: userRow.password,
				role: userRow.role,
				group: userRow?.group,
				variant: userRow?.variant,
				phone: userRow?.phone,
			};

			try {
				if (await bcrypt.compare(password, user.password)) {
					const accessToken = generateToken(
						user,
						ACCESS_TOKEN_SECRET
					);

					res.json({ accessToken, role: user.role });
				} else {
					res.send({ message: "Not Allowed" });
				}
			} catch {
				res.status(500).send();
			}
		}
	);
});

function generateToken(user: User, secretAccessToken: string) {
	return jwt.sign(user, secretAccessToken);
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (token == null) {
		return res.sendStatus(401);
	}

	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({ message: "Server error" });
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user as User;
		next();
	});
}

function requireRole(role: string) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (!req?.user || req.user.role !== role) {
			res.status(403).send({ message: "Forbidden" });
		} else {
			next();
		}
	};
}

app.get(
	"/admin",
	authenticateToken,
	requireRole("admin"),
	(req: Request, res: Response) => {
		// Fetch data for the admin user and all other users
		db.all("SELECT * FROM Users", (err, usersRows: User[]) => {
			if (err) {
				console.error(err);
				return res.status(500).send({ message: "Server error" });
			}

			const usersData = usersRows.map((userRow) => ({
				name: userRow.name,
				group: userRow.group,
				variant: userRow.variant,
				phone: userRow.phone,
				role: userRow.role,
			}));

			res.status(200).send({
				userInfo: {
					name: req.user?.name,
					group: req.user?.group,
					variant: req.user?.variant,
					phone: req.user?.phone,
					role: req.user?.role,
				},
				usersInfo: usersData,
			});
		});
	}
);

app.get(
	"/user",
	authenticateToken,
	requireRole("user"),
	(req: Request, res: Response) => {
		// Fetch data for the regular user
		db.get(
			"SELECT * FROM Users WHERE name = ?",
			[req.user?.name],
			(err, userRow: User) => {
				if (err) {
					console.error(err);
					return res.status(500).send({ message: "Server error" });
				}

				if (!userRow) {
					return res
						.status(400)
						.send({ message: "Cannot find user" });
				}

				const userData = {
					name: userRow.name,
					group: userRow.group,
					variant: userRow.variant,
					phone: userRow.phone,
					role: userRow.role,
				};

				res.status(200).send({ userInfo: userData });
			}
		);
	}
);

app.get("/whoami", authenticateToken, (req: Request, res: Response) => {
	res.json(req.user);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
