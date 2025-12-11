import {useState, type FormEvent, type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {Button, Checkbox, Input} from '../../components/primary';
import {useAuth} from '../../hooks/useAuth.tsx';

export default function RegisterPage() {
	const {register, isLoading: authLoading} = useAuth();

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [errors, setErrors] = useState<{username?: string; email?: string; password?: string; general?: string}>({});
	const [successMessage, setSuccessMessage] = useState('');

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});
		setSuccessMessage('');

		// Validation
		const newErrors: {username?: string; email?: string; password?: string; general?: string} = {};
		if (!username.trim()) {
			newErrors.username = 'Username is required';
		} else if (username.length < 3) {
			newErrors.username = 'Username must be at least 3 characters';
		}
		if (!email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Invalid email format';
		}
		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
		}
		if (!agreedToTerms) {
			newErrors.general = 'You must agree to the Terms and Privacy Policy';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const response = await register({username, email, password});
			setSuccessMessage(response.message || 'Registration successful! Please check your email to verify your account.');
			// Clear form
			setUsername('');
			setEmail('');
			setPassword('');
			setAgreedToTerms(false);
		} catch (error: any) {
			console.error('Registration failed:', error);
			setErrors({
				general: error.response?.data?.message || 'Registration failed. Please try again.',
			});
		}
	};

	const handleGoogleSignUp = () => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		if (!backendUrl) {
			console.error('VITE_BACKEND_URL is not defined');
			return;
		}
		window.location.href = `${backendUrl}/oauth2/authorization/google`;
	};


	// Custom label for terms checkbox
	const termsLabel: ReactNode = (
		<span className="text-gray-600">
			I agree to the{' '}
			<a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
				Terms of Service
			</a>{' '}
			and{' '}
			<a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
				Privacy Policy
			</a>
		</span>
	);

	return (
		<div className="min-h-screen flex bg-white">
			{/* --- Left Column: Branding / Marketing (Hidden on Mobile) --- */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden">
				{/* Decorative Circles */}
				<div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
				<div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-purple-900 rounded-full opacity-50 blur-3xl"></div>

				<div className="relative z-10 w-full flex flex-col justify-center px-12 xl:px-24">
					<div className="mb-8">
						<div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/10 mb-6">
							<i className="fas fa-link text-white text-3xl"></i>
						</div>
						<h1 className="text-4xl font-bold text-white tracking-tight mb-4">Start your journey.</h1>
						<p className="text-lg text-indigo-100 max-w-md">
							Join thousands of developers and marketers building smarter connections with Intelink.
						</p>
					</div>

					{/* Feature List instead of Testimonial for Register Page */}
					<div className="space-y-4">
						{['Unlimited custom short links', 'Advanced analytics & tracking', 'Team collaboration features'].map(
							(feature, idx) => (
								<div key={idx} className="flex items-center gap-3 text-indigo-100">
									<div className="h-6 w-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
										<i className="fas fa-check text-white text-sm"></i>
									</div>
									<span>{feature}</span>
								</div>
							)
						)}
					</div>
				</div>
			</div>

			{/* --- Right Column: Register Form --- */}
			<div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					{/* Mobile Logo */}
					<div className="lg:hidden flex items-center gap-2 mb-8">
						<i className="fas fa-link text-indigo-500 text-3xl"></i>
						<span className="text-2xl font-bold text-gray-900">Intelink</span>
					</div>

					<div>
						<h2 className="text-2xl font-bold tracking-tight text-gray-900">Create an account</h2>
						<p className="mt-2 text-sm text-gray-600">Get started with your free 14-day trial.</p>
					</div>

					<div className="mt-8">
						{/* Registration Form */}
						<form onSubmit={handleRegister} className="space-y-5">
							{errors.general && (
								<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
									<i className="fas fa-exclamation-circle mr-2"></i>
									{errors.general}
								</div>
							)}

							{successMessage && (
								<div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
									<i className="fas fa-check-circle mr-2"></i>
									{successMessage}
								</div>
							)}

							<Input
								label="Username"
								type="text"
								placeholder="johndoe"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								error={errors.username}
								fullWidth
								required
								autoComplete="username"
							/>

							<Input
								label="Email address"
								type="email"
								placeholder="name@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								error={errors.email}
								fullWidth
								required
								autoComplete="email"
							/>

							<Input
								label="Password"
								type={showPassword ? 'text' : 'password'}
								placeholder="Create a strong password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								error={errors.password}
								fullWidth
								required
								autoComplete="new-password"
								helpText="Must be at least 8 characters."
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

							<div className="flex items-start">
								<Checkbox
									id="terms"
									label={termsLabel}
									checked={agreedToTerms}
									onChange={(checked) => setAgreedToTerms(checked)}
								/>
							</div>

							<div className="pt-2">
								<Button
									type="submit"
									variant="primary"
									fullWidth
									loading={authLoading}
									disabled={!agreedToTerms}
									className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
								>
									Create account
								</Button>
							</div>
						</form>

						{/* Divider */}
						<div className="relative mt-6">
							<div className="absolute inset-0 flex items-center" aria-hidden="true">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-gray-50 lg:bg-white px-2 text-gray-500">Or sign up with</span>
							</div>
						</div>

						{/* Social Sign Up */}
						<div className="mt-6">
							<Button
								variant="outline"
								fullWidth
								icon={<i className="fab fa-google text-lg"></i>}
								onClick={handleGoogleSignUp}
								className="justify-center"
							>
								Sign up with Google
							</Button>
						</div>

						{/* Footer / Login Link */}
						<div className="mt-8 text-center">
							<p className="text-sm text-gray-600">
								Already have an account?{' '}
								<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
									Log in
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}