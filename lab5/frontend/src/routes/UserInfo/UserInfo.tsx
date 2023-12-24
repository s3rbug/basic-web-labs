import { useContext } from "react";
import { UserInfoContext } from "../../context/UserInfo/UserInfo";
import { Navigate } from "react-router-dom";
import { authApi } from "../../api/auth/auth";

export default function UserInfo() {
	const { token, userInfo, usersInfo, setUsersInfo } =
		useContext(UserInfoContext);

	if (!token || !userInfo) {
		return <Navigate to={"/login"} />;
	}

	async function onDeleteUser(userName: string) {
		if (!token) return;
		try {
			const adminDataResponse = await authApi.deleteUser({
				accessToken: token,
				userName,
			});
			setUsersInfo(adminDataResponse.usersInfo);
		} catch (err) {
			console.error("Delete error");
		}
	}

	return (
		<div className="flex flex-col gap-10">
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
			{userInfo?.role === "admin" && usersInfo && (
				<div className="flex w-full justify-center mt-10 text-[#0065E5] text-xl gap-10">
					<div className="flex flex-col gap-4 border-indigo-500 rounded-2xl border-2 p-10 bg-gradient-to-r from-[#FFF3F0] from-60% to-[#DDE1FD] to-100%">
						<h1 className="flex justify-center text-2xl">
							{"All users in the database:"}
						</h1>
						{usersInfo.map((user, index) => (
							<div
								className="flex gap-1 flex-col"
								key={user?.name ?? index}>
								{user?.name && (
									<div className="flex gap-2 justify-between">
										<div>{`Username: ${user.name}`}</div>
										<button
											onClick={() => {
												if (user?.name) {
													onDeleteUser(user.name);
												}
											}}
											className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-2xl text-sm font-bold">
											Delete
										</button>
									</div>
								)}
								{user?.role && (
									<div>{`Role: ${user.role}`}</div>
								)}
								{user?.variant && (
									<div>{`Variant: ${user.variant}`}</div>
								)}
								{user?.phone && (
									<div>{`Phone: ${user.phone}`}</div>
								)}
								{user?.group && (
									<div>{`Group: ${user.group}`}</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
