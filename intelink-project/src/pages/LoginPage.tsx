import { useAuth } from "../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LoginRequest } from "../dto/request/UserRequest.ts";
import { BACKEND_URL } from "../types/environment.ts";
import { LoginForm, SocialLoginSection } from "../components/auth";
import { Button } from "../components/ui";
import { Header } from "../components/layout/Header.tsx";

export function LoginPage() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleError = (error: unknown) => {
		if (error && error instanceof Error) {
			const err = error as {
				code?: string;
				response?: { status?: number; data?: { message?: string } };
			};
			if (err.code === "NETWORK_ERROR") {
				setError("Network error. Please check your connection.");
			} else if (err.response?.status === 401) {
				setError("Invalid credentials. Please try again.");
			} else {
				setError(
					err.response?.data?.message || "An unexpected error occurred.",
				);
			}
		} else {
			setError("An unexpected error occurred.");
		}
	};

	const handleLogin = async (credentials: LoginRequest) => {
		try {
			setLoading(true);
			setError(null);

			await login(credentials);

			navigate("/dashboard", { replace: true });
		} catch (err: unknown) {
			handleError(err);
			console.error("Login error:", err);
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

	const handleSignUp = () => {
		navigate("/register");
	};

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header onLanguageChange={() => {}} />

			<div className="flex justify-center items-center">
				<div className="w-full max-w-6xl p-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<div className="text-center mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Log in to Intelink
							</h1>
						</div>

						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						<div className="flex flex-col lg:flex-row w-full items-center justify-center ">
							<div className="w-1/2">
								<LoginForm onSubmit={handleLogin} loading={loading} />
								<p className="text-sm text-gray-600 my-4 text-center">
									Don't have an account?
								</p>
								<Button
									variant="outline"
									fullWidth
									size="lg"
									onClick={handleSignUp}
								>
									Sign up
								</Button>
							</div>
							<div className="flex flex-col justify-center items-center p-4">
								OR
							</div>
							<div className="w-1/2 h-full flex flex-col justify-center items-center">
								<SocialLoginSection
									onGoogleLogin={() => handleGoogleLogin()}
									onGitHubLogin={() => handleGitHubLogin()}
									loading={loading}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
