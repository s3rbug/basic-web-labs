import { Dispatch } from "react";
import { User } from "../../api/auth/auth.types";

export type UserInfoContextType = {
	userInfo: User;
	setUserInfo: Dispatch<React.SetStateAction<User>>;
	usersInfo: User[];
	setUsersInfo: Dispatch<React.SetStateAction<User[]>>;
	token?: string;
	setToken: Dispatch<React.SetStateAction<string | undefined>>;
};
