import { useContext, useState } from "react";
import { authApi } from "../../api/auth/auth";
import AuthElement, {
	FormInputType,
} from "../../components/AuthElement/AuthElement";
import { UserInfoContext } from "../../context/UserInfo/UserInfo";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [error, setError] = useState<null | string>(null);
	const { setToken, setUserInfo } = useContext(UserInfoContext);
  const navigate = useNavigate()
	async function onSubmit(data: FormInputType) {
		try {
			const loginResponse = await authApi.login({
				name: data.name,
				password: data.password,
			});
			setToken(loginResponse.accessToken);
			if (loginResponse.role === "admin") {
        const adminDataResponse = await authApi.adminData({
					accessToken: loginResponse.accessToken,
				});
        setUserInfo(adminDataResponse.userInfo)
			} else {
				const userDataResponse = await authApi.userData({
					accessToken: loginResponse.accessToken,
				});
        setUserInfo(userDataResponse.userInfo)
			}
      navigate("/user-info")
		} catch (err) {
			console.error("Login error");
			setError(`${err}`);
		}
	}
	return (
		<AuthElement
			onSubmit={onSubmit}
			headerText="authorization system"
			submitText="Sign in"
			serverError={error}
      clearServerError={() => setError(null)}
		/>
	);
}
