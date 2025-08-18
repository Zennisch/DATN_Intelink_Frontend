import { useState } from "react";
import type { LoginRequest } from "../../models/User.ts";
import { Button } from "../ui";
import { Checkbox } from "../ui";
import { Input } from "../ui";

interface LoginFormProps {
	onSubmit: (credentials: LoginRequest) => Promise<void>;
	loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
	onSubmit,
	loading = false,
}) => {
	const [formData, setFormData] = useState<LoginRequest>({
		username: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [keepSignedIn, setKeepSignedIn] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginRequest> = {};

		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			await onSubmit(formData);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	const handleInputChange =
		(field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({
				...prev,
				[field]: e.target.value,
			}));

			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			}
		};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<Input
					type="text"
					label="Username"
					placeholder="Enter your Username"
					value={formData.username}
					onChange={handleInputChange("username")}
					error={errors.username}
					fullWidth
					required
				/>

				<div className="relative">
					<Input
						type={showPassword ? "text" : "password"}
						label="Your password"
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

			<div className="flex items-center justify-between">
				<Checkbox
					id="keep-signed-in"
					checked={keepSignedIn}
					onChange={setKeepSignedIn}
					label="Keep me signed in until I sign out"
				/>

				<a
					href="/forgot-password"
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
				loading={loading}
			>
				Log in
			</Button>
		</form>
	);
};
