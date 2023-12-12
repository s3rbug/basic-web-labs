import { useContext } from "react";
import { UserInfoContext } from "../../context/UserInfo/UserInfo";
import { Navigate } from "react-router-dom";

export default function UserInfo() {
	const { token, userInfo } = useContext(UserInfoContext);
	if (!token || !userInfo) {
		return <Navigate to={"/login"} />;
	}

	return (
		<div className="flex w-full justify-center mt-10 text-[#0065E5] text-xl gap-10">
			<div className="flex flex-col gap-14 border-indigo-500 rounded-2xl border-2 p-10 bg-gradient-to-r from-[#FFF3F0] from-60% to-[#DDE1FD] to-100%">
				<h1 className="flex justify-center text-2xl">
					{userInfo?.role === "admin"
						? "Admin information:"
						: "User information:"}
				</h1>
				<div className="flex flex-col gap-4">
					{Object.entries(userInfo).map(([key, value], index) => {
						return (
							<div key={`info-${index}`}>
								{key}: {value}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
