import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Button, Input } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { ForgotPasswordRequest } from "../dto/request/UserRequest";

const validateForgotPassword = (values: ForgotPasswordRequest): Partial<ForgotPasswordRequest> => {
	const errors: Partial<ForgotPasswordRequest> = {};
	
	if (!values.email.trim()) {
		errors.email = "Email is required";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "Please enter a valid email address";
	}

	return errors;
};

export function ForgotPasswordPage() {
	const navigate = useNavigate();
	const { forgotPassword } = useAuth();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleError = (error: any) => {
		if (error.code === "NETWORK_ERROR") {
			setError("Network error. Please check your connection.");
		} else {
			setError(
				error.response?.data?.message || "An unexpected error occurred.",
			);
		}
	};

	const handleForgotPassword = async (credentials: ForgotPasswordRequest) => {
		try {
			setLoading(true);
			setError(null);

			const response = await forgotPassword(credentials);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Failed to send reset email. Please try again.");
			}
		} catch (err: any) {
			handleError(err);
			console.error("Forgot password error:", err);
		} finally {
			setLoading(false);
		}
	};

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<ForgotPasswordRequest>(
			{ email: "" },
			validateForgotPassword,
			handleForgotPassword,
			500,
		);

	const handleBackToLogin = () => {
		navigate("/login");
	};

	if (success) {
		return (
			<div className="min-h-screen bg-gray-50 font-inter">
				<Header />

				<div className="flex items-center justify-center min-h-screen pt-20">
					<div className="w-full max-w-2xl p-8">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
							{/* Success Icon */}
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
										d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7"
									/>
								</svg>
							</div>

							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Check your email
							</h1>
							
							<p className="text-gray-600 mb-6">
								If an account with email <strong>{formData.email}</strong> exists, 
								we've sent you a password reset link.
							</p>

							<div className="bg-blue-50 rounded-lg p-4 mb-6">
								<p className="text-sm text-blue-800">
									<strong>Note:</strong> The reset link will expire in 15 minutes. 
									Please check your spam folder if you don't see the email.
								</p>
							</div>

							<div className="space-y-3">
								<Button
									variant="primary"
									fullWidth
									size="lg"
									onClick={handleBackToLogin}
								>
									Back to Login
								</Button>
								
								<Button
									variant="outline"
									fullWidth
									size="lg"
									onClick={() => setSuccess(false)}
								>
									Try Different Email
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header />

			<div className="flex items-center justify-center min-h-screen pt-20">
				<div className="w-full max-w-2xl p-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Forgot your password?
							</h1>
							<p className="text-gray-600">
								Enter your email address and we'll send you a link to reset your password.
							</p>
						</div>

						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<Input
								type="email"
								label="Email Address"
								placeholder="Enter your email address"
								value={formData.email}
								onChange={handleInputChange("email")}
								error={errors.email}
								fullWidth
								required
							/>

							<Button
								type="submit"
								variant="primary"
								fullWidth
								size="lg"
								loading={loading || isSubmitting}
							>
								Send Reset Link
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
