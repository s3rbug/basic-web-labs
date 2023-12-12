import { Dispatch } from "react";

export type UserInfoType = {
	name?: string;
	group?: string;
	variant?: number;
	phone?: string;
	role?: string;
};

export type UserInfoContextType = {
	userInfo: UserInfoType;
	setUserInfo: Dispatch<React.SetStateAction<UserInfoType>>;
	token?: string;
	setToken: Dispatch<React.SetStateAction<string | undefined>>;
};
