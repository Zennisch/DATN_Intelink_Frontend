import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm, SocialLoginSection } from "../components/auth";
import { Header } from "../components/layout/Header";
import { Button, Divider } from "../components/ui";
import type { RegisterRequest } from "../dto/request/UserRequest.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { BACKEND_URL } from "../types/environment.ts";

export function RegisterPage() {
	const { register } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLanguageChange = (language: string) => {
		// TODO: Implement language change logic
		console.log('Language changed to:', language);
	};

	const handleError = (error: any) => {
		if (error.code === "NETWORK_ERROR") {
			setError("Network error. Please check your connection.");
		} else if (error.response?.status === 409) {
			setError(
				"Username or email already exists. Please try different credentials.",
			);
		} else if (error.response?.status === 400) {
			setError("Invalid input. Please check your information and try again.");
		} else {
			setError(
				error.response?.data?.message || "An unexpected error occurred.",
			);
		}
	};

	const handleRegister = async (credentials: RegisterRequest) => {
		try {
			setLoading(true);
			setError(null);

			const response = await register(credentials);

			if (response.success) {
				// Navigate to success page with email info
				navigate("/register/success", {
					state: {
						email: credentials.email,
						emailVerified: response.emailVerified,
					},
				});
			} else {
				setError(response.message || "Registration failed. Please try again.");
			}
		} catch (err: any) {
			handleError(err);
			console.error("Registration error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuth2Login = (provider: "google" | "github") => {
		setLoading(true);
		window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
	};

	const handleGoogleLogin = () => {
		setError(null);
		handleOAuth2Login("google");
	};

	const handleGitHubLogin = () => {
		setError(null);
		handleOAuth2Login("github");
	};

	const handleBackToLogin = () => {
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header onLanguageChange={handleLanguageChange} />

			<div className="flex items-center justify-center min-h-screen pt-20">
				<div className="w-full max-w-2xl p-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Create your Intelink account
							</h1>
							<p className="text-gray-600">
								Join thousands of users who trust Intelink for URL shortening
							</p>
						</div>

						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<div className="mb-6">
							<SocialLoginSection
								onGoogleLogin={() => handleGoogleLogin()}
								onGitHubLogin={() => handleGitHubLogin()}
								loading={loading}
							/>
						</div>

						<div className="mb-6">
							<Divider />
						</div>

						<div className="mb-6">
							<RegisterForm onSubmit={handleRegister} loading={loading} />
						</div>

						<div className="text-center">
							<p className="text-sm text-gray-600 mb-4">
								Already have an account?
							</p>
							<Button
								variant="outline"
								fullWidth
								size="lg"
								onClick={handleBackToLogin}
							>
								Sign in
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
