import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ShortUrlService } from "../services/ShortUrlService";
import icon from "../assets/icon.png";

const UnlockUrlPage: React.FC = () => {
	const { shortCode } = useParams<{ shortCode: string }>();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [unlockInfo, setUnlockInfo] = useState<{
		success: boolean;
		message: string;
		shortCode: string;
	} | null>(null);

	useEffect(() => {
		if (shortCode) {
			fetchUnlockInfo();
		}
	}, [shortCode]);

	const fetchUnlockInfo = async () => {
		try {
			setPageLoading(true);
			const info = await ShortUrlService.getUnlockInfo(shortCode!);
			
			if (!info.success) {
				setError(info.message || "This link does not require a password");
				setPageLoading(false);
				return;
			}

			setUnlockInfo(info);
		} catch (error: any) {
			console.error("Error fetching unlock info:", error);
			if (error.response?.status === 404) {
				setError("Link not found");
			} else if (error.response?.status === 400) {
				// URL doesn't require password, redirect to direct access
				window.location.href = `/${shortCode}`;
				return;
			} else {
				setError("Failed to load link information");
			}
		} finally {
			setPageLoading(false);
		}
	};

	const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
        setError("Please enter the password");
        return;
    }

    setLoading(true);
    setError("");

    try {
        const result = await ShortUrlService.unlockUrl(shortCode!, password);
        if (result.success && result.redirectUrl) {
            // Chuyển hướng tới URL trả về từ backend
            window.location.href = result.redirectUrl;
        } else {
            setError(result.message || "Failed to unlock URL");
        }
    } catch (error: any) {
        console.error("Error unlocking URL:", error);
        setError("Incorrect password or URL is unavailable");
    } finally {
        setLoading(false);
    }
};

	const handleGoHome = () => {
		navigate("/");
	};

	// Loading state
	if (pageLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<div className="max-w-md w-full">
					<div className="bg-white rounded-xl shadow-lg p-8 text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Loading...</p>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error && !unlockInfo) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<div className="max-w-md w-full">
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<img src={icon} alt="Intelink Logo" className="w-16 h-16" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900">Intelink</h1>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-8 text-center">
						<div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
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
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							{error}
						</h2>
						<p className="text-gray-600 text-sm mb-6">
							The link you're looking for might have been removed or is no longer available.
						</p>
						<Button onClick={handleGoHome} variant="outline">
							← Back to Intelink
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Logo */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<img src={icon} alt="Intelink Logo" className="w-16 h-16" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Intelink</h1>
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-xl shadow-lg p-8">
					{/* Lock Icon */}
					<div className="text-center mb-6">
						<div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
							<svg
								className="w-8 h-8 text-gray-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Protected Link
						</h2>
						<p className="text-gray-600 text-sm">
							This link is password protected. Please enter the password to continue.
						</p>
					</div>

					{/* URL Info */}
					<div className="bg-gray-50 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
								<svg
									className="w-4 h-4 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<div className="font-medium text-gray-900">
									{`${window.location.origin}/${shortCode}`}
								</div>
								<div className="text-sm text-gray-500">
									{unlockInfo?.message || "This link is password protected"}
								</div>
							</div>
						</div>
					</div>

					{/* Password Form */}
					<form onSubmit={handleUnlock} className="space-y-4">
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<Input
								id="password"
								type="password"
								placeholder="Enter password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								className="w-full"
							/>
						</div>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-3">
								<div className="flex items-center gap-2">
									<svg
										className="w-4 h-4 text-red-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span className="text-sm text-red-700">{error}</span>
								</div>
							</div>
						)}

						<Button
							type="submit"
							disabled={loading || !password.trim()}
							className="w-full"
						>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
										/>
									</svg>
									Unlocking...
								</div>
							) : (
								<div className="flex items-center justify-center gap-2">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
										/>
									</svg>
									Unlock Link
								</div>
							)}
						</Button>
					</form>

					{/* Footer */}
					<div className="mt-6 pt-6 border-t border-gray-200 text-center">
						<button
							onClick={handleGoHome}
							className="text-blue-600 hover:text-blue-700 text-sm font-medium"
						>
							← Back to Intelink
						</button>
					</div>
				</div>

				{/* Security Note */}
				<div className="mt-6 text-center">
					<p className="text-xs text-gray-500">
						🔒 This link is secured by Intelink. Your privacy is protected.
					</p>
				</div>
			</div>
		</div>
	);
};

export default UnlockUrlPage;
