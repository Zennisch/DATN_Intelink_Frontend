import { useState } from "react";
import { LoginForm } from "../components/auth/LoginForm";
import { handleOAuth2Login, SocialLoginSection } from "../components/auth/SocialLogin";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { Divider } from "../components/ui/Divider";
import { useAuth } from "../contexts/AuthContext";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import type { LoginRequest } from "../models/User";

function LoginPage() {
	const { login } = useAuth();
	const { redirectToDashboard } = useAuthNavigation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleLogin = async (credentials: LoginRequest) => {
		try {
			setLoading(true);
			setError(null);

			await login(credentials);

			redirectToDashboard();
		} catch (err: any) {
			setError(
				err.response?.data?.message || "Login failed. Please try again.",
			);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
        setError(null);
        handleOAuth2Login('google');
    };

    const handleGitHubLogin = () => {
        setError(null);
        handleOAuth2Login('github');
    };

	const handleSignUp = () => {
        console.log("Sign up clicked");
    };

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header />

			<div className="flex items-center justify-center min-h-screen pt-20">
				<div className="w-full max-w-2xl p-8">
					{/* Main Content */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						{/* Title */}
						<div className="text-center mb-8">
							<h1 className="text-2xl font-semibold text-gray-900 mb-2">
								Log in to Intelink
							</h1>
						</div>

						{/* Error Message */}
						{error && (
							<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						{/* Social Login */}
						<div className="mb-6">
							<SocialLoginSection
								onGoogleLogin={() => handleGoogleLogin()}
								onGitHubLogin={() => handleGitHubLogin()}
								loading={loading}
							/>
						</div>

						{/* Divider */}
						<div className="mb-6">
							<Divider />
						</div>

						{/* Login Form */}
						<div className="mb-6">
							<LoginForm onSubmit={handleLogin} loading={loading} />
						</div>

						{/* Sign Up Link */}
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

export default LoginPage;
