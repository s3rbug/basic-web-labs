export type UserRoleType = "admin" | "user";

export type User = {
	name?: string;
	group?: string;
	variant?: number;
	phone?: string;
	role?: string;
};

export type LoginType = {
	name: string;
	password: string;
};

export type LoginReturnType = {
	accessToken: string;
	role: UserRoleType;
};

export type RegisterReturnType = {
	message: string;
	accessToken: string;
	role: UserRoleType;
};

export type RegisterType = {
	name: string;
	password: string;
	role: UserRoleType;
};

export type AdminDataType = {
	accessToken: string;
};

export type AdminDataReturnType = {
	userInfo: User;
	usersInfo: User[];
};

export type UserDataType = {
	accessToken: string;
};

export type UserDataReturnType = {
	userInfo: User;
};

export type DeleteUserType = {
	accessToken: string;
	userName: string;
};

export type DeleteUserReturnType = {
	usersInfo: User[];
};
