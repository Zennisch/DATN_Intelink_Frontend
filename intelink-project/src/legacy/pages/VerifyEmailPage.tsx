import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header.tsx";
import { Button } from "../components/ui";
import { useAuth } from "../hooks/useAuth.ts";

export function VerifyEmailPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { verifyEmail } = useAuth();

	const [isVerifying, setIsVerifying] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState(5);

	const handleLanguageChange = (language: string) => {
		// TODO: Implement language change logic
		console.log('Language changed to:', language);
	};

	useEffect(() => {
		const token = searchParams.get("token");

		if (!token) {
			setError("Invalid verification link. No token provided.");
			setIsVerifying(false);
			return;
		}

		const handleVerifyEmail = async () => {
			try {
				setIsVerifying(true);
				setError(null);

				const response = await verifyEmail(token);

				if (response.success) {
					setIsSuccess(true);

					// Start countdown
					const timer = setInterval(() => {
						setCountdown((prev) => {
							if (prev <= 1) {
								navigate("/login", { replace: true });
								return 0;
							}
							return prev - 1;
						});
					}, 1000);

					return () => clearInterval(timer);
				} else {
					setError(response.message || "Email verification failed.");
				}
			} catch (err: any) {
				console.error("Email verification error:", err);

				if (err.response?.status === 400) {
					setError("Invalid or expired verification token.");
				} else if (err.response?.status === 409) {
					setError("Email is already verified.");
				} else {
					setError(
						err.response?.data?.message ||
							"An unexpected error occurred during verification.",
					);
				}
			} finally {
				setIsVerifying(false);
			}
		};

		handleVerifyEmail();
	}, [searchParams, verifyEmail, navigate]);

	const handleGoToLogin = () => {
		navigate("/login", { replace: true });
	};

	const handleResendVerification = () => {
		// This would typically trigger a resend verification email API call
		console.log("Resend verification email");
		// For now, just show a message
		alert(
			"Feature not implemented yet. Please contact support if you need a new verification email.",
		);
	};

	return (
		<div className="min-h-screen bg-gray-50 font-inter">
			<Header onLanguageChange={handleLanguageChange} />

			<div className="flex items-center justify-center min-h-screen pt-16 md:pt-20 px-4">
				<div className="w-full max-w-2xl py-6 md:p-8">
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 text-center">
						{isVerifying ? (
							// Loading State
							<>
								<div className="mx-auto flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 mb-4 md:mb-6">
									<svg
										className="w-7 h-7 md:w-8 md:h-8 text-blue-600 animate-spin"
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
								</div>

								<h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
									Verifying your email...
								</h1>

								<p className="text-sm md:text-base text-gray-600">
									Please wait while we verify your email address.
								</p>
							</>
						) : isSuccess ? (
							// Success State
							<>
								<div className="mx-auto flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 mb-4 md:mb-6">
									<svg
										className="w-7 h-7 md:w-8 md:h-8 text-green-600"
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

								<h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
									Email Verified Successfully!
								</h1>

								<p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
									Your email has been verified. You can now log in to your
									account.
								</p>

								<div className="mb-4 md:mb-6">
									<p className="text-xs md:text-sm text-gray-500">
										Redirecting to login page in{" "}
										<span className="font-semibold text-blue-600">
											{countdown}
										</span>{" "}
										second{countdown !== 1 ? "s" : ""}...
									</p>
								</div>

								<Button
									variant="primary"
									fullWidth
									size="lg"
									onClick={handleGoToLogin}
								>
									Go to Login Page
								</Button>
							</>
						) : (
							// Error State
							<>
								<div className="mx-auto flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-100 mb-4 md:mb-6">
									<svg
										className="w-7 h-7 md:w-8 md:h-8 text-red-600"
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

								<h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
									Email Verification Failed
								</h1>

								<p className="text-sm md:text-base text-red-600 mb-4 md:mb-6">{error}</p>

								<div className="space-y-3">
									<Button
										variant="primary"
										fullWidth
										size="lg"
										onClick={handleGoToLogin}
									>
										Go to Login Page
									</Button>

									<Button
										variant="outline"
										fullWidth
										size="lg"
										onClick={handleResendVerification}
									>
										Resend Verification Email
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
