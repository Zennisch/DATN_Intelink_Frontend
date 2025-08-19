import { useState } from "react";
import { LoginForm, SocialLoginSection } from "../components/auth";
import { Header } from "../components/layout/Header";
import { Button, Divider } from "../components/ui";
import type { LoginRequest } from "../dto/request/UserRequest.ts";
import { useAuth } from "../hooks/useAuth.ts";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { BACKEND_URL } from "../types/environment.ts";

export function LoginPage() {
	const { login } = useAuth();
	const { redirectToDashboard } = useAuthNavigation();
	const [loading, setLoading] = useState(false);
	const [oauthLoading, setOauthLoading] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleError = (error: any) => {
		if (error.code === "NETWORK_ERROR") {
			setError("Network error. Please check your connection.");
		} else if (error.response?.status === 401) {
			setError("Invalid credentials. Please try again.");
		} else {
			setError(
				error.response?.data?.message || "An unexpected error occurred.",
			);
		}
	};

	const handleLogin = async (credentials: LoginRequest) => {
		try {
			setLoading(true);
			setError(null);

			await login(credentials);

			redirectToDashboard();
		} catch (err: any) {
			handleError(err);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuth2Login = (provider: "google" | "github") => {
		setOauthLoading(provider);
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
		console.log("Sign up clicked");
	};

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header />

			<div className="flex items-center justify-center min-h-screen pt-20">
				<div className="w-full max-w-2xl p-8">
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
							<LoginForm onSubmit={handleLogin} loading={loading} />
						</div>

						<div className="text-center">
							<p className="text-sm text-gray-600 mb-4">
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
					</div>
				</div>
			</div>
		</div>
	);
}
