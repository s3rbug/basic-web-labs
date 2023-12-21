import { Link, createBrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import UserInfo from "./UserInfo/UserInfo";

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/user-info",
		element: <UserInfo />,
	},
	{
		path: "/*",
		element: (
			<h1 className="flex flex-col items-center w-full text-3xl">
				<div>Not Found</div>
				<Link to="/login" className="text-blue-800 text-lg">
					Back to login
				</Link>
			</h1>
		),
		errorElement: (
			<h1 className="flex justify-center w-full text-3xl">
				404 Not Found
			</h1>
		),
	},
]);
