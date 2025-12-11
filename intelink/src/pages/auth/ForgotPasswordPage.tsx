import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../../components/primary';
import { useAuth } from '../../hooks/useAuth.tsx';

export default function ForgotPasswordPage() {
	const {forgotPassword, isLoading: authLoading} = useAuth();

	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submittedEmail, setSubmittedEmail] = useState('');
	const [errors, setErrors] = useState<{email?: string; general?: string}>({});

	const handleResetRequest = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validation
		const newErrors: {email?: string} = {};
		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Invalid email format';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await forgotPassword({email});
			setSubmittedEmail(email);
			setIsSubmitted(true);
		} catch (error: any) {
			console.error('Forgot password request failed:', error);
			setErrors({
				general: error.response?.data?.message || 'Failed to send reset email. Please try again.',
			});
		}
	};

	const handleResend = async () => {
		try {
			await forgotPassword({email: submittedEmail});
			alert(`Reset link resent to ${submittedEmail}`);
		} catch (error: any) {
			console.error('Resend failed:', error);
			alert('Failed to resend email. Please try again.');
		}
	};


	return (
		<div className="min-h-screen flex bg-white">
			{/* --- Left Column: Branding / Marketing --- */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<svg className="h-full w-full" width="100%" height="100%">
						<pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<circle cx="2" cy="2" r="1" className="text-white" fill="currentColor" />
						</pattern>
						<rect width="100%" height="100%" fill="url(#dot-pattern)" />
					</svg>
				</div>

				<div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

				<div className="relative z-10 w-full flex flex-col justify-center px-12 xl:px-24">
					<div className="mb-8">
						<div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-xl shadow-lg mb-6">
							<i className="fas fa-shield-alt text-white text-3xl"></i>
						</div>
						<h1 className="text-4xl font-bold text-white tracking-tight mb-4">Secure & Reliable.</h1>
						<p className="text-lg text-slate-300 max-w-md">
							Don't worry, it happens to the best of us. We'll help you recover your access in no time so you can
							get back to managing your links.
						</p>
					</div>
				</div>
			</div>

			{/* --- Right Column: Form Area --- */}
			<div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center gap-2 mb-8">
						<i className="fas fa-link text-indigo-500 text-3xl"></i>
						<span className="text-2xl font-bold text-gray-900">Intelink</span>
					</div>

					{/* Conditional Rendering: Form vs Success Message */}
					{!isSubmitted ? (
						// --- STATE 1: Input Form ---
						<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="mb-6">
								<div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
									<i className="fas fa-key text-indigo-500 text-2xl"></i>
								</div>
								<h2 className="text-2xl font-bold tracking-tight text-gray-900">Forgot password?</h2>
								<p className="mt-2 text-sm text-gray-600">No worries, we'll send you reset instructions.</p>
							</div>

							<form onSubmit={handleResetRequest} className="space-y-6">
								{errors.general && (
									<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
										<i className="fas fa-exclamation-circle mr-2"></i>
										{errors.general}
									</div>
								)}

								<Input
									label="Email address"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									error={errors.email}
									fullWidth
									required
									autoComplete="email"
									autoFocus
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
						// --- STATE 2: Success Message ---
						<div className="text-center animate-in fade-in zoom-in-95 duration-500">
							<div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
								<i className="fas fa-envelope text-green-500 text-3xl"></i>
							</div>

							<h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Check your email</h2>

							<p className="text-gray-600 mb-8">
								We sent a password reset link to <br />
								<span className="font-medium text-gray-900">{submittedEmail}</span>
							</p>

							<div className="space-y-4">
								<Button
									variant="primary"
									fullWidth
									onClick={() => window.open('mailto:', '_blank')}
									className="bg-indigo-600 hover:bg-indigo-700"
								>
									Open email app
								</Button>

								<p className="text-sm text-gray-500">
									Didn't receive the email?{' '}
									<button onClick={handleResend} className="text-indigo-600 font-medium hover:text-indigo-500">
										Click to resend
									</button>
								</p>

								<div className="pt-4">
									<Link
										to="/login"
										className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
									>
										<i className="fas fa-arrow-left mr-2 text-xs"></i>
										Back to log in
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}