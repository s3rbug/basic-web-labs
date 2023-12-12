import {
  createBrowserRouter,
} from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import UserInfo from "./UserInfo/UserInfo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <h1 className="flex justify-center w-full text-3xl">Not Found</h1>,
    errorElement: <h1 className="flex justify-center w-full text-3xl">404 Not Found</h1>,
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/user-info",
    element: <UserInfo />
  },
]);