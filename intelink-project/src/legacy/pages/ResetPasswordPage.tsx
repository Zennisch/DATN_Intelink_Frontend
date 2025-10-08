import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header.tsx";
import { Button, Input } from "../components/ui";
import { useAuth } from "../hooks/useAuth.ts";
import { useForm } from "../hooks/useForm.ts";
import type { ResetPasswordRequest } from "../dto/request/UserRequest.ts";

interface ResetPasswordFormData extends ResetPasswordRequest {
	confirmPassword: string;
}

const validateResetPassword = (
	values: ResetPasswordFormData,
): Partial<ResetPasswordFormData> => {
	const errors: Partial<ResetPasswordFormData> = {};

	if (!values.password) {
		errors.password = "New password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = "Please confirm your password";
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = "Passwords do not match";
	}

	return errors;
};

export function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { resetPassword } = useAuth();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleLanguageChange = (language: string) => {
		// TODO: Implement language change logic
		console.log('Language changed to:', language);
	};

	const token = searchParams.get("token");

	const handleError = (error: any) => {
		if (error.code === "NETWORK_ERROR") {
			setError("Network error. Please check your connection.");
		} else if (error.response?.status === 400) {
			setError(
				"Invalid or expired reset token. Please request a new password reset.",
			);
		} else {
			setError(
				error.response?.data?.message || "An unexpected error occurred.",
			);
		}
	};

	const handleResetPassword = async (formData: ResetPasswordFormData) => {
		if (!token) {
			setError("Invalid reset link. No token provided.");
			return;
		}

		try {
			setLoading(true);
			setError(null);

			const request: ResetPasswordRequest = {
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			};

			const response = await resetPassword(token, request);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(
					response.message || "Failed to reset password. Please try again.",
				);
			}
		} catch (err: any) {
			handleError(err);
			console.error("Reset password error:", err);
		} finally {
			setLoading(false);
		}
	};

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<ResetPasswordFormData>(
			{ password: "", confirmPassword: "" },
			validateResetPassword,
			handleResetPassword,
			500,
		);

	const handleBackToLogin = () => {
		navigate("/login");
	};

	const handleGoToLogin = () => {
		navigate("/login");
	};

	// Check if token is missing
	if (!token) {
		return (
			<div className="min-h-screen bg-gray-50 font-inter">
				<Header onLanguageChange={handleLanguageChange} />

				<div className="flex items-center justify-center min-h-screen pt-20">
					<div className="w-full max-w-2xl p-8">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
							<div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
								<svg
									className="w-8 h-8 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</div>

							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Invalid Reset Link
							</h1>

							<p className="text-gray-600 mb-6">
								This password reset link is invalid or has expired. Please
								request a new password reset.
							</p>

							<div className="space-y-3">
								<Button
									variant="primary"
									fullWidth
									size="lg"
									onClick={() => navigate("/forgot-password")}
								>
									Request New Reset Link
								</Button>

								<Button
									variant="outline"
									fullWidth
									size="lg"
									onClick={handleBackToLogin}
								>
									Back to Login
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Success state
	if (success) {
		return (
			<div className="min-h-screen bg-gray-50 font-inter">
				<Header onLanguageChange={handleLanguageChange} />

				<div className="flex items-center justify-center min-h-screen pt-20">
					<div className="w-full max-w-2xl p-8">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
							<div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
								<svg
									className="w-8 h-8 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>

							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Password Reset Successful!
							</h1>

							<p className="text-gray-600 mb-6">
								Your password has been successfully reset. You can now log in
								with your new password.
							</p>

							<Button
								variant="primary"
								fullWidth
								size="lg"
								onClick={handleGoToLogin}
							>
								Go to Login Page
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Reset password form
	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header onLanguageChange={handleLanguageChange} />

			<div className="flex items-center justify-center min-h-screen pt-20">
				<div className="w-full max-w-2xl p-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Reset your password
							</h1>
							<p className="text-gray-600">Enter your new password below.</p>
						</div>

						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									label="New Password"
									placeholder="Enter your new password"
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

							<div className="relative">
								<Input
									type={showConfirmPassword ? "text" : "password"}
									label="Confirm New Password"
									placeholder="Confirm your new password"
									value={formData.confirmPassword}
									onChange={handleInputChange("confirmPassword")}
									error={errors.confirmPassword}
									fullWidth
									required
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-3 top-10 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
								>
									{showConfirmPassword ? "Hide" : "Show"}
								</button>
							</div>

							<Button
								type="submit"
								variant="primary"
								fullWidth
								size="lg"
								loading={loading || isSubmitting}
							>
								Reset Password
							</Button>
						</form>

						<div className="mt-6 text-center">
							<Button
								variant="outline"
								fullWidth
								size="lg"
								onClick={handleBackToLogin}
							>
								Back to Login
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
