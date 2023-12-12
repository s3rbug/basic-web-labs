import { createContext, useState } from "react";
import { ContextProviderType } from "../context.type";
import { UserInfoContextType, UserInfoType } from "./UserInfo.types";

export const UserInfoContext = createContext<UserInfoContextType>({
	userInfo: {},
	setUserInfo: () => {},
	token: undefined,
	setToken: () => {},
});

export function UserInfoProvider({ children }: ContextProviderType) {
	const [userInfo, setUserInfo] = useState<UserInfoType>({});
	const [token, setToken] = useState<string | undefined>(undefined);
	return (
		<UserInfoContext.Provider
			value={{ userInfo, setUserInfo, token, setToken }}
		>
			{children}
		</UserInfoContext.Provider>
	);
}
