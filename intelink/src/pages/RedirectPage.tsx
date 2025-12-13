import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShortUrlService } from "../services/ShortUrlService";
import { type RedirectResult, RedirectResultType } from "../models/Redirect";
import { Button } from "../components/primary";
import icon from "../assets/icon.png";

const RedirectPage: React.FC = () => {
	const { shortCode } = useParams<{ shortCode: string }>();
	const navigate = useNavigate();
	
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [redirectResult, setRedirectResult] = useState<RedirectResult | null>(null);
	const [countdown, setCountdown] = useState(5);
	const [password, setPassword] = useState("");
	const [unlocking, setUnlocking] = useState(false);

	useEffect(() => {
		if (shortCode) {
			fetchRedirectInfo();
		}
	}, [shortCode]);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		if (redirectResult?.type === RedirectResultType.SUCCESS && countdown > 0) {
			timer = setTimeout(() => setCountdown(c => c - 1), 1000);
		} else if (redirectResult?.type === RedirectResultType.SUCCESS && countdown === 0) {
			if (redirectResult.redirectUrl) {
				window.location.href = redirectResult.redirectUrl;
			}
		}
		return () => clearTimeout(timer);
	}, [redirectResult, countdown]);

	const fetchRedirectInfo = async () => {
		try {
			setLoading(true);
			const result = await ShortUrlService.accessShortUrl(shortCode!);
			setRedirectResult(result);
			
			// If immediate redirect is preferred without countdown, uncomment below:
			// if (result.type === RedirectResultType.SUCCESS && result.redirectUrl) {
			//     window.location.href = result.redirectUrl;
			// }
		} catch (err: any) {
			console.error("Error fetching redirect info:", err);
			setError("Failed to load link information. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleUnlock = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password.trim()) return;

		try {
			setUnlocking(true);
			setError(null);
			const result = await ShortUrlService.accessShortUrl(shortCode!, password);
			
			if (result.type === RedirectResultType.SUCCESS) {
				setRedirectResult(result);
				// Reset countdown or redirect immediately
				if (result.redirectUrl) {
					window.location.href = result.redirectUrl;
				}
			} else if (result.type === RedirectResultType.INCORRECT_PASSWORD) {
				setError(result.message || "Incorrect password");
			} else {
				setRedirectResult(result);
			}
		} catch (err: any) {
			console.error("Error unlocking:", err);
			setError("An error occurred while unlocking");
		} finally {
			setUnlocking(false);
		}
	};

	const renderContent = () => {
		if (loading) {
			return (
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Checking link...</p>
				</div>
			);
		}

		if (error && !redirectResult) {
			return (
				<div className="text-center">
					<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
						<i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
					<p className="text-gray-600 text-sm mb-6">{error}</p>
					<Button onClick={() => navigate("/")} variant="outline">
						Go to Homepage
					</Button>
				</div>
			);
		}

		if (!redirectResult) return null;

		switch (redirectResult.type) {
			case RedirectResultType.SUCCESS:
				return (
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
							<i className="fas fa-check text-green-600 text-2xl"></i>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Link Ready!</h2>
						<p className="text-gray-600 text-sm mb-6">
							Redirecting to destination in <span className="font-bold text-blue-600">{countdown}</span> seconds...
						</p>
						<div className="flex justify-center gap-3">
							<Button onClick={() => window.location.href = redirectResult.redirectUrl!} variant="primary">
								Go Now
							</Button>
						</div>
						<p className="text-xs text-gray-400 mt-4 break-all">
							Destination: {redirectResult.redirectUrl}
						</p>
					</div>
				);

			case RedirectResultType.PASSWORD_PROTECTED:
			case RedirectResultType.INCORRECT_PASSWORD:
				return (
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<i className="fas fa-lock text-gray-600 text-2xl"></i>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Protected Link</h2>
						<p className="text-gray-600 text-sm mb-6">
							This link is password protected. Please enter the password to continue.
						</p>
						
						<form onSubmit={handleUnlock} className="space-y-4 text-left">
							<div>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter password"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
									autoFocus
								/>
								{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
							</div>
							<Button type="submit" className="w-full" disabled={unlocking}>
								{unlocking ? "Unlocking..." : "Unlock Link"}
							</Button>
						</form>
					</div>
				);

			case RedirectResultType.NOT_FOUND:
				return (
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<i className="fas fa-search text-gray-400 text-2xl"></i>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Link Not Found</h2>
						<p className="text-gray-600 text-sm mb-6">
							The link you are looking for does not exist or has been removed.
						</p>
						<Button onClick={() => navigate("/")} variant="outline">
							Go to Homepage
						</Button>
					</div>
				);

			case RedirectResultType.UNAVAILABLE:
				return (
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
							<i className="fas fa-ban text-yellow-600 text-2xl"></i>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Link Unavailable</h2>
						<p className="text-gray-600 text-sm mb-6">
							This link is currently unavailable (expired, disabled, or limit reached).
						</p>
						<Button onClick={() => navigate("/")} variant="outline">
							Go to Homepage
						</Button>
					</div>
				);

			case RedirectResultType.ACCESS_DENIED:
				return (
					<div className="text-center">
						<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
							<i className="fas fa-shield-alt text-red-600 text-2xl"></i>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
						<p className="text-gray-600 text-sm mb-6">
							You do not have permission to access this link.
						</p>
						<Button onClick={() => navigate("/")} variant="outline">
							Go to Homepage
						</Button>
					</div>
				);

			default:
				return (
					<div className="text-center">
						<p className="text-gray-600">Unknown status</p>
						<Button onClick={() => navigate("/")} variant="outline" className="mt-4">
							Go to Homepage
						</Button>
					</div>
				);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<img src={icon} alt="Intelink Logo" className="w-16 h-16" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Intelink</h1>
				</div>

				<div className="bg-white rounded-xl shadow-lg p-8">
					{renderContent()}
				</div>

				<div className="mt-6 text-center">
					<p className="text-xs text-gray-500">
						Powered by Intelink
					</p>
				</div>
			</div>
		</div>
	);
};

export default RedirectPage;
