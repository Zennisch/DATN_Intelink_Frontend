import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAuthNavigation } from "../hooks/useAuthNavigation";

function OAuth2CallbackPage() {
	const [searchParams] = useSearchParams();
	const { oAuthCallback } = useAuth();
	const { redirectToDashboard, redirectToLogin } = useAuthNavigation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleOAuth2Callback = async () => {
			try {
				const token = searchParams.get("token");

				if (!token) {
					throw new Error("No token received from OAuth2 provider");
				}

				await oAuthCallback(token);

				redirectToDashboard();
			} catch (err: any) {
				console.error("OAuth2 callback error:", err);
				setError(err.message || "Authentication failed");

				setTimeout(() => {
					redirectToLogin();
				}, 3000);
			} finally {
				setLoading(false);
			}
		};

		handleOAuth2Callback();
	}, [searchParams, oAuthCallback, redirectToDashboard, redirectToLogin]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<h2 className="text-lg font-semibold text-gray-900 mb-2">
						Completing authentication...
					</h2>
					<p className="text-gray-600">Please wait while we sign you in.</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
						<h2 className="text-lg font-semibold mb-2">
							Authentication Failed
						</h2>
						<p>{error}</p>
					</div>
					<p className="text-gray-600">Redirecting to login page...</p>
				</div>
			</div>
		);
	}

	return null;
}

export default OAuth2CallbackPage;
