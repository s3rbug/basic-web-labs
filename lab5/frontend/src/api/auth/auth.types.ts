export type UserRoleType = "admin" | "user"

export type LoginType = {
	name: string;
	password: string;
};

export type LoginReturnType = {
	accessToken: string;
  role: UserRoleType
};

export type RegisterReturnType = {
	message: string;
	accessToken: string;
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
  userInfo: object
};

export type UserDataType = {
	accessToken: string;
};

export type UserDataReturnType = {
  userInfo: object
};
