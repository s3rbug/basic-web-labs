import { useContext, useState } from "react";
import AuthElement, {
	FormInputType,
} from "../../components/AuthElement/AuthElement";
import { UserInfoContext } from "../../context/UserInfo/UserInfo";
import { authApi } from "../../api/auth/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
	const [error, setError] = useState<null | string>(null);
	const { setToken, setUserInfo } = useContext(UserInfoContext);
	const navigate = useNavigate()
	async function onSubmit(data: FormInputType) {
		try {
			const registerResponse = await authApi.register({
				name: data.name,
				password: data.password,
				role: "user"
			});
			setToken(registerResponse.accessToken);
			if (registerResponse.role === "admin") {
        const adminDataResponse = await authApi.adminData({
					accessToken: registerResponse.accessToken,
				});
        setUserInfo(adminDataResponse.userInfo)
			} else {
				const userDataResponse = await authApi.userData({
					accessToken: registerResponse.accessToken,
				});
        setUserInfo(userDataResponse.userInfo)
			}
      navigate("/user-info")
		} catch (err) {
			console.error("Register error");
			setError(`${err}`);
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
