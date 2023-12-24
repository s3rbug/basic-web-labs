import { createContext, useState } from "react";
import { ContextProviderType } from "../context.type";
import { UserInfoContextType } from "./UserInfo.types";
import { User } from "../../api/auth/auth.types";

export const UserInfoContext = createContext<UserInfoContextType>({
	userInfo: {},
	setUserInfo: () => {},
	usersInfo: [],
	setUsersInfo: () => {},
	token: undefined,
	setToken: () => {},
});

export function UserInfoProvider({ children }: ContextProviderType) {
	const [userInfo, setUserInfo] = useState<User>({});
	const [usersInfo, setUsersInfo] = useState<User[]>([]);
	const [token, setToken] = useState<string | undefined>(undefined);
	return (
		<UserInfoContext.Provider
			value={{
				userInfo,
				setUserInfo,
				usersInfo,
				setUsersInfo,
				token,
				setToken,
			}}>
			{children}
		</UserInfoContext.Provider>
	);
}
