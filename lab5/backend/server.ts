import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

type UserRole = "admin" | "user";

type User = {
	name: string;
	password: string;
	role: UserRole;
};

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

let users: User[] = [
	{
		name: "user",
		password: "$2b$10$KT91Y/5TKVDkjTDsaoSa6.gCV1ClruOdTwH7owes46e.iKka9LQ5u",
		role: "user",
	},
	{
		name: "admin",
		password: "$2b$10$KT91Y/5TKVDkjTDsaoSa6.gCV1ClruOdTwH7owes46e.iKka9LQ5u",
		role: "admin",
	},
];

const app = express();

app.use(cors());

app.use(express.json());

app.post("/register", async (req: Request, res: Response) => {
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({ message: "Server error" });
	}
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user: User = {
			name: req.body.name,
			password: hashedPassword,
			role: req.body.role,
		};
		users.push(user);
		const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET);
		res
			.status(201)
			.send({ message: `User '${user.name}' created`, accessToken });
	} catch {
		res.status(500).send();
	}
});

app.post("/login", async (req: Request, res: Response) => {
	const user = users.find((user) => user.name === req.body.name);
	if (!user) {
		return res.status(400).send({ message: "Cannot find user" });
	}
	if (!process.env.ACCESS_TOKEN_SECRET) {
		return res.status(500).send({ message: "Server error" });
	}
	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			const accessToken = generateToken(user, process.env.ACCESS_TOKEN_SECRET);
			res.json({ accessToken, role: user.role });
		} else {
			res.send({ message: "Not Allowed" });
		}
	} catch {
		res.status(500).send();
	}
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
	(_: Request, res: Response) => {
		res.status(200).send({
			userInfo: {
				name: "Serhii",
				group: "IO-01",
				variant: 22,
				phone: "11-22-33",
				role: "admin",
			},
		});
	}
);

app.get(
	"/user",
	authenticateToken,
	requireRole("user"),
	(_: Request, res: Response) => {
		res.status(200).send({
			userInfo: {
				name: "Serhii",
				group: "IO-01",
				variant: 22,
				phone: "11-22-33",
				role: "user",
			},
		});
	}
);

app.get("/whoami", authenticateToken, (req: Request, res: Response) => {
	res.json(req.user);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
