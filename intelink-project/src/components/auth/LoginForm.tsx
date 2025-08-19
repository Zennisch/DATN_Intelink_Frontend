import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Input } from "../ui";
import type { LoginRequest } from "../../dto/request/UserRequest.ts";
import { useForm } from "../../hooks/useForm.ts";

interface LoginFormProps {
	onSubmit: (credentials: LoginRequest) => Promise<void>;
	loading?: boolean;
}

const validateLogin = (values: LoginRequest): Partial<LoginRequest> => {
	const errors: Partial<LoginRequest> = {};
	if (!values.username.trim()) {
		errors.username = "Username is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}
	return errors;
};

export const LoginForm = ({ onSubmit, loading = false }: LoginFormProps) => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [keepSignedIn, setKeepSignedIn] = useState(false);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<LoginRequest>(
			{ username: "", password: "" },
			validateLogin,
			onSubmit,
			500,
		);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<Input
					type="text"
					label="Username"
					placeholder="Username/Email"
					value={formData.username}
					onChange={handleInputChange("username")}
					error={errors.username}
					fullWidth
					required
				/>

				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						label="Password"
						placeholder="Password"
						value={formData.password}
						onChange={handleInputChange("password")}
						error={errors.password}
						fullWidth
						required
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-10 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
					>
						{showPassword ? "Hide" : "Show"}
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<Checkbox
					id="keep-signed-in"
					checked={keepSignedIn}
					onChange={setKeepSignedIn}
					label="Keep me signed in until I sign out"
				/>

				<a
					href="/forgot-password"
					onClick={(e) => {
						e.preventDefault();
						navigate("/forgot-password");
					}}
					className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
				>
					Forget your password?
				</a>
			</div>

			<Button
				type="submit"
				variant="primary"
				fullWidth
				size="lg"
				loading={loading || isSubmitting}
			>
				Log in
			</Button>
		</form>
	);
};
