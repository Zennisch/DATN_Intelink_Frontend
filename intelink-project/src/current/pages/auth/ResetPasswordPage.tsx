import {useState, type FormEvent, useEffect} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {Button, Input} from '../../components/primary';
import {useAuth} from '../../hooks/useAuth.tsx';

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const {resetPassword, isLoading: authLoading} = useAuth();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [errors, setErrors] = useState<{password?: string; confirmPassword?: string; general?: string}>({});
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const tokenFromUrl = searchParams.get('token');
		if (!tokenFromUrl) {
			setErrors({general: 'Invalid or missing reset token. Please request a new password reset link.'});
		}
		setToken(tokenFromUrl);
	}, [searchParams]);

	const handleResetPassword = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validation
		const newErrors: {password?: string; confirmPassword?: string; general?: string} = {};
		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}
		if (!confirmPassword) {
			newErrors.confirmPassword = 'Please confirm your password';
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}
		if (!token) {
			newErrors.general = 'Invalid reset token';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await resetPassword(token!, {password, confirmPassword});
			setIsSuccess(true);
			// Auto-redirect to login after 2 seconds
			setTimeout(() => {
				navigate('/login');
			}, 2000);
		} catch (error: any) {
			console.error('Reset password failed:', error);
			setErrors({
				general: error.response?.data?.message || 'Failed to reset password. Please try again or request a new reset link.',
			});
		}
	};


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
							<i className="fas fa-shield-alt text-white text-3xl"></i>
						</div>
						<h1 className="text-4xl font-bold text-white tracking-tight mb-4">Safety first.</h1>
						<p className="text-lg text-gray-300 max-w-md">
							Create a strong password to keep your links and analytics data secure.
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

					{!isSuccess ? (
						// --- FORM VIEW ---
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6">
								<div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
									<i className="fas fa-lock text-indigo-500 text-2xl"></i>
								</div>
								<h2 className="text-2xl font-bold tracking-tight text-gray-900">Set new password</h2>
								<p className="mt-2 text-sm text-gray-600">
									Your new password must be different to previously used passwords.
								</p>
							</div>

							<form onSubmit={handleResetPassword} className="space-y-6">
								{errors.general && (
									<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
										<i className="fas fa-exclamation-circle mr-2"></i>
										{errors.general}
									</div>
								)}

								<Input
									label="New Password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									error={errors.password}
									fullWidth
									required
									helpText="Must be at least 8 characters"
									endAdornment={
										<button
											type="button"
											className="focus:outline-none focus:text-indigo-600 transition-colors"
											onClick={() => setShowPassword(!showPassword)}
											tabIndex={-1}
										>
											<i
												className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500 hover:text-gray-700`}
											></i>
										</button>
									}
								/>

								<Input
									label="Confirm Password"
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder="••••••••"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									error={errors.confirmPassword}
									fullWidth
									required
									endAdornment={
										<button
											type="button"
											className="focus:outline-none focus:text-indigo-600 transition-colors"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											tabIndex={-1}
										>
											<i
												className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500 hover:text-gray-700`}
											></i>
										</button>
									}
								/>

								<Button
									type="submit"
									variant="primary"
									fullWidth
									loading={authLoading}
									className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
								>
									Reset password
								</Button>
							</form>

							<div className="mt-8 text-center">
								<Link
									to="/login"
									className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
								>
									<i className="fas fa-arrow-left mr-2 text-xs"></i>
									Back to log in
								</Link>
							</div>
						</div>
					) : (
						// --- SUCCESS VIEW ---
						<div className="text-center animate-in fade-in zoom-in-95 duration-500">
							<div className="mx-auto flex items-center justify-center mb-6">
								<i className="fas fa-check-circle text-green-500 text-6xl"></i>
							</div>

							<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Password reset</h2>

							<p className="text-gray-600 mb-8">
								Your password has been successfully reset. <br />
								Click below to log in securely.
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
					)}
				</div>
			</div>
		</div>
	);
}