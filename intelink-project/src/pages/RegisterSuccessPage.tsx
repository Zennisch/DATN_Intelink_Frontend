import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui";

interface RegisterSuccessState {
	email: string;
	emailVerified: boolean;
}

export function RegisterSuccessPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [countdown, setCountdown] = useState(3);

	const state = location.state as RegisterSuccessState | null;
	const email = state?.email || "";
	const emailVerified = state?.emailVerified || false;

	useEffect(() => {
		// If no state is passed, redirect immediately to login
		if (!state) {
			navigate("/login", { replace: true });
			return;
		}

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
	}, [navigate, state]);

	const handleGoToLogin = () => {
		navigate("/login", { replace: true });
	};

	if (!state) {
		return null; // Will redirect
	}

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
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>

						{/* Success Message */}
						<h1 className="text-2xl font-semibold text-gray-900 mb-2">
							Account Created Successfully!
						</h1>

						<p className="text-gray-600 mb-6">
							Welcome to Intelink! Your account has been created successfully.
						</p>

						{/* Email Verification Status */}
						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-gray-700 mb-2">
								<strong>Email:</strong> {email}
							</p>
							{emailVerified ? (
								<div className="flex items-center justify-center text-green-600">
									<svg
										className="w-4 h-4 mr-2"
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
									<span className="text-sm font-medium">Email verified</span>
								</div>
							) : (
								<div className="flex items-center justify-center text-amber-600">
									<svg
										className="w-4 h-4 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
										/>
									</svg>
									<span className="text-sm font-medium">
										Please check your email to verify your account
									</span>
								</div>
							)}
						</div>

						{/* Countdown */}
						<div className="mb-6">
							<p className="text-sm text-gray-500">
								Redirecting to login page in{" "}
								<span className="font-semibold text-blue-600">{countdown}</span>{" "}
								second{countdown !== 1 ? "s" : ""}...
							</p>
						</div>

						{/* Action Buttons */}
						<div className="space-y-3">
							<Button
								variant="primary"
								fullWidth
								size="lg"
								onClick={handleGoToLogin}
							>
								Go to Login Page
							</Button>

							{!emailVerified && (
								<p className="text-xs text-gray-500">
									Don't forget to check your email inbox and spam folder for the
									verification email.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
