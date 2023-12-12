import { useForm } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage/ErrorMessage";
import { RedirectBlock } from "./RedirectBlock/RedirectBlock";

export type FormInputType = {
	name: string;
	password: string;
	confirm_password?: string;
};

type Props = {
	headerText: string;
	submitText: string;
	onSubmit: (data: FormInputType) => void;
	serverError: null | string;
	clearServerError: () => void;
	isRegister?: boolean;
};

export default function AuthElement({
	headerText,
	submitText,
	onSubmit,
	serverError,
	clearServerError,
	isRegister,
}: Props) {
	const {
		register,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<FormInputType>();

	function customOnChange() {
		clearErrors("root.serverError");
		clearServerError();
	}

	if (!errors.root && serverError) {
		setError("root.serverError", {
			message: serverError,
		});
	}

	return (
		<div className="flex w-full justify-center mt-10">
			<div className="flex flex-col gap-10 border-indigo-500 rounded-2xl border-2 p-10 bg-gradient-to-r from-[#FFF3F0] from-60% to-[#DDE1FD] to-100%">
				<h1 className="flex justify-center text-2xl text-[#0065E5]">
					{headerText}
				</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<input
						placeholder="name"
						className="outline-none border-[#E3E3E4] border-2 rounded-md p-2"
						{...register("name", {
							required: {
								value: true,
								message: "Name is required field",
							},
							maxLength: {
								value: 20,
								message: "Max name length is 20",
							},
							onChange: customOnChange,
						})}
					/>
					{<ErrorMessage message={errors?.name?.message} />}
					<input
						type="password"
						placeholder="password"
						className="outline-none border-[#E3E3E4] border-2 rounded-md p-2"
						{...register("password", {
							required: {
								value: true,
								message: "Password is required field",
							},
							maxLength: {
								value: 20,
								message: "Max password length is 20",
							},
              onChange: customOnChange,
						})}
					/>
					{<ErrorMessage message={errors?.password?.message} />}
					{isRegister && (
						<input
							type="password"
							placeholder="confirm password"
							className="outline-none border-[#E3E3E4] border-2 rounded-md p-2"
							{...register("confirm_password", {
								required: true,
								validate: (value?: string) => {
									if (watch("password") != value) {
										return "Your passwords do not match";
									}
								},
                onChange: customOnChange,
							})}
						/>
					)}
					{isRegister && (
						<ErrorMessage message={errors?.confirm_password?.message} />
					)}
					<ErrorMessage message={errors?.root?.serverError?.message} />
					{isRegister ? (
						<RedirectBlock
							infoText="Already have an account?"
							linkText="Log in instead"
							linkHref="/login"
						/>
					) : (
						<RedirectBlock
							infoText="Do not have an account yet?"
							linkText="Register instead"
							linkHref="/register"
						/>
					)}
					<input
						type="submit"
						value={submitText}
						className="bg-gray-200 py-4 hover:bg-gray-300 active:bg-blue-100 text-gray-800"
					/>
				</form>
			</div>
		</div>
	);
}
