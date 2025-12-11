import {useEffect, useState} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Button} from '../../components/primary/Button';
import {useAuth} from '../../hooks/useAuth';

export default function VerifyEmailPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const {verifyEmail, isLoading: authLoading} = useAuth();

	const [isVerifying, setIsVerifying] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const verifyToken = async () => {
			const tokenParam = searchParams.get('token');

			if (!tokenParam) {
				setError('Verification token is missing. Please check your email link.');
				setIsVerifying(false);
				return;
			}

			setToken(tokenParam);

			try {
				await verifyEmail(tokenParam);
				setIsSuccess(true);
				setError(null);
			} catch (err: any) {
				const errorMessage = err?.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.';
				setError(errorMessage);
				setIsSuccess(false);
			} finally {
				setIsVerifying(false);
			}
		};

		verifyToken();
	}, [searchParams, verifyEmail]);

	return (
		<div className="min-h-screen flex bg-white">
			{/* --- Left Column: Branding --- */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
				{/* Abstract Tech Lines */}
				<div className="absolute inset-0">
					<svg className="h-full w-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
						<path d="M0 100 C 50 0 80 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
						<path d="M0 100 C 80 0 100 0 100 100 Z" fill="none" stroke="white" strokeWidth="0.5" />
					</svg>
				</div>

				<div className="absolute inset-0 bg-linear-to-br from-indigo-900/80 to-gray-900/90" />

				<div className="relative z-10 w-full flex flex-col justify-center px-12 xl:px-24">
					<div className="mb-8">
						<div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-xl shadow-lg mb-6">
							<i className="fas fa-envelope-open-text text-white text-3xl"></i>
						</div>
						<h1 className="text-4xl font-bold text-white tracking-tight mb-4">Almost there!</h1>
						<p className="text-lg text-gray-300 max-w-md">
							We're verifying your email address to complete your registration and unlock all features.
						</p>
					</div>
				</div>
			</div>

			{/* --- Right Column: Content --- */}
			<div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center gap-2 mb-8">
						<i className="fas fa-link text-indigo-500 text-3xl"></i>
						<span className="text-2xl font-bold text-gray-900">Intelink</span>
					</div>

					{isVerifying ? (
						// --- VERIFYING STATE ---
						<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
								<i className="fas fa-spinner fa-spin text-indigo-500 text-2xl"></i>
							</div>
							<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Verifying your email</h2>
							<p className="text-gray-600">Please wait while we verify your email address...</p>
						</div>
					) : isSuccess ? (
						// --- SUCCESS STATE ---
						<div className="text-center animate-in fade-in zoom-in-95 duration-500">
							<div className="mx-auto flex items-center justify-center mb-6">
								<i className="fas fa-check-circle text-green-500 text-6xl"></i>
							</div>

							<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Email verified!</h2>

							<p className="text-gray-600 mb-8">
								Your email has been successfully verified. <br />
								You can now log in to your account.
							</p>

							<Button
								variant="primary"
								fullWidth
								onClick={() => navigate('/login')}
								className="bg-indigo-600 hover:bg-indigo-700"
							>
								Continue to Log in
							</Button>
						</div>
					) : (
						// --- ERROR STATE ---
						<div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="h-14 w-14 bg-red-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
								<i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
							</div>

							<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Verification failed</h2>

							<p className="text-gray-600 mb-6">{error}</p>

							<div className="space-y-3">
								<Button
									variant="primary"
									fullWidth
									onClick={() => navigate('/register')}
									className="bg-indigo-600 hover:bg-indigo-700"
								>
									Create new account
								</Button>

								<Link
									to="/login"
									className="block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
								>
									<i className="fas fa-arrow-left mr-2 text-xs"></i>
									Back to log in
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
