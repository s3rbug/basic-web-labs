import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./index.css";
import { UserInfoProvider } from "./context/UserInfo/UserInfo";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<UserInfoProvider>
			<RouterProvider router={router} />
		</UserInfoProvider>
	</React.StrictMode>
);
