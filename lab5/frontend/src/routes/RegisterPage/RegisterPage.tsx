import { useContext, useState } from "react";
import AuthElement, {
	FormInputType,
} from "../../components/AuthElement/AuthElement";
import { UserInfoContext } from "../../context/UserInfo/UserInfo";
import { authApi } from "../../api/auth/auth";

export default function RegisterPage() {
	const [error, setError] = useState<null | string>(null);
	const { setToken } = useContext(UserInfoContext);
	async function onSubmit(data: FormInputType) {
		try {
			const response = await authApi.register({
				name: data.name,
				password: data.password,
				role: "user",
			});
			setToken(response.accessToken);
		} catch {
			console.error("Login error");
			setError("");
		}
	}
	return (
		<AuthElement
			serverError={error}
			onSubmit={onSubmit}
			headerText="registration system"
			submitText="Register"
			clearServerError={() => setError(null)}
			isRegister
		/>
	);
}
