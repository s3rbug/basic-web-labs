import { CONFIG } from "../config";
import {
	AdminDataReturnType,
	AdminDataType,
	LoginReturnType,
	LoginType,
	RegisterReturnType,
	RegisterType,
	UserDataReturnType,
	UserDataType,
} from "./auth.types";

export const authApi = {
	login: async ({ name, password }: LoginType): Promise<LoginReturnType> => {
		const response = await fetch(`${CONFIG.BASE_URL}/login`, {
			body: JSON.stringify({ name, password }),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});
		if (!response.ok) {
			if (response.status === 403 || response.status === 400) {
				throw new Error("Wrong credentials");
			}
			if (response.status === 500) {
				throw new Error("Server error");
			}
			throw new Error(response.statusText);
		}
		return response.json();
	},
	register: async ({
		name,
		password,
	}: RegisterType): Promise<RegisterReturnType> => {
		const response = await fetch(`${CONFIG.BASE_URL}/register`, {
			body: JSON.stringify({ name, password }),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});
    if (!response.ok) {
			if (response.status === 500) {
				throw new Error("Server error");
			}
			throw new Error(response.statusText);
		}
		return response.json();
	},
	adminData: async ({
		accessToken,
	}: AdminDataType): Promise<AdminDataReturnType> => {
		const response = await fetch(`${CONFIG.BASE_URL}/admin`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			method: "GET",
		});
    if (!response.ok) {
			if (response.status === 500) {
				throw new Error("Server error");
			}
			throw new Error(response.statusText);
		}
		return response.json();
	},
	userData: async ({
		accessToken,
	}: UserDataType): Promise<UserDataReturnType> => {
		const response = await fetch(`${CONFIG.BASE_URL}/user`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			method: "GET",
		});
    if (!response.ok) {
			if (response.status === 500) {
				throw new Error("Server error");
			}
			throw new Error(response.statusText);
		}
		return response.json();
	},
};
