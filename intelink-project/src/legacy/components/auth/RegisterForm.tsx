import { useState } from "react";
import { Button, Checkbox, Input } from "../ui";
import type { RegisterRequest } from "../../dto/request/UserRequest.ts";
import { useForm } from "../../hooks/useForm.ts";

interface RegisterFormProps {
	onSubmit: (credentials: RegisterRequest) => Promise<void>;
	loading?: boolean;
}

const validateRegister = (
	values: RegisterRequest,
): Partial<RegisterRequest> => {
	const errors: Partial<RegisterRequest> = {};

	if (!values.username.trim()) {
		errors.username = "Username is required";
	} else if (values.username.length < 3) {
		errors.username = "Username must be at least 3 characters";
	}

	if (!values.email.trim()) {
		errors.email = "Email is required";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "Please enter a valid email address";
	}

	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}

	return errors;
};

export const RegisterForm = ({
	onSubmit,
	loading = false,
}: RegisterFormProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<RegisterRequest>(
			{ username: "", email: "", password: "" },
			validateRegister,
			onSubmit,
			500,
		);

	const isFormValid =
		agreeToTerms && formData.username && formData.email && formData.password;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<Input
					type="text"
					label="Username"
					placeholder="Enter your username"
					value={formData.username}
					onChange={handleInputChange("username")}
					error={errors.username}
					fullWidth
					required
				/>

				<Input
					type="email"
					label="Email"
					placeholder="Enter your email"
					value={formData.email}
					onChange={handleInputChange("email")}
					error={errors.email}
					fullWidth
					required
				/>

				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						label="Password"
						placeholder="Enter your password"
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

			<div className="space-y-4">
				<Checkbox
					id="agree-terms"
					checked={agreeToTerms}
					onChange={setAgreeToTerms}
					label={
						<span className="text-sm text-gray-600">
							I agree to the{" "}
							<a
								href="/terms"
								className="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Terms of Service
							</a>{" "}
							and{" "}
							<a
								href="/privacy"
								className="text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Privacy Policy
							</a>
						</span>
					}
				/>
			</div>

			<Button
				type="submit"
				variant="primary"
				fullWidth
				size="lg"
				loading={loading || isSubmitting}
				disabled={!isFormValid}
			>
				Create Account
			</Button>
		</form>
	);
};
