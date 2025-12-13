import {useState, type FormEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button, Checkbox, Input} from '../../components/primary';
import {useAuth} from '../../hooks/useAuth.tsx';

export default function LoginPage() {
	const navigate = useNavigate();
	const {login, isLoading: authLoading} = useAuth();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({});

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});

		// Validation
		const newErrors: {username?: string; password?: string} = {};
		if (!username.trim()) {
			newErrors.username = 'Email or username is required';
		}
		if (!password) {
			newErrors.password = 'Password is required';
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await login({username, password});
			navigate('/dashboard');
		} catch (error: any) {
			console.error('Login failed:', error);
			setErrors({
				general: error.response?.data?.message || 'Login failed. Please check your credentials.',
			});
		}
	};

	const handleGoogleLogin = () => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		if (!backendUrl) {
			console.error('VITE_BACKEND_URL is not defined');
			return;
		}
		window.location.href = `${backendUrl}/oauth2/authorization/google`;
	};

	return (
		<div className="min-h-screen flex bg-white">
			{/* --- Left Column: Branding / Marketing (Hidden on Mobile) --- */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden">
				{/* Abstract Background Pattern */}
				<div className="absolute inset-0 opacity-20">
					<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<defs>
							<pattern id="grid-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
								<path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid-pattern)" />
					</svg>
				</div>

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 to-gray-900/90" />

				<div className="relative z-10 w-full flex flex-col justify-center px-12 xl:px-24">
					<div className="mb-8">
						<div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-xl shadow-lg mb-6">
							<i className="fas fa-link text-white text-3xl"></i>
						</div>
						<h1 className="text-4xl font-bold text-white tracking-tight mb-4">Intelink</h1>
						<p className="text-lg text-indigo-200 max-w-md">
							Shorten URLs, expand your reach. Analytics-driven link management for modern businesses.
						</p>
					</div>

					{/* Testimonial or Stat */}
					<div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 max-w-md">
						<p className="text-gray-300 italic mb-4">
							"Intelink transformed how we track our marketing campaigns. Simple, fast, and reliable."
						</p>
						<div className="flex items-center gap-3">
							<div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold text-indigo-900">
								JS
							</div>
							<div>
								<div className="text-sm font-semibold text-white">Jane Smith</div>
								<div className="text-xs text-gray-400">Marketing Director</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* --- Right Column: Login Form --- */}
			<div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
				<div className="mx-auto w-full max-w-sm lg:w-96">
					{/* Mobile Logo (Visible only on small screens) */}
					<div className="lg:hidden flex items-center gap-2 mb-8">
						<i className="fas fa-link text-indigo-500 text-3xl"></i>
						<span className="text-2xl font-bold text-gray-900">Intelink</span>
					</div>

					<div>
						<h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h2>
						<p className="mt-2 text-sm text-gray-600">Please enter your details to sign in.</p>
					</div>

					<div className="mt-8">
						{/* Email/Password Form */}
						<form onSubmit={handleLogin} className="space-y-6">
							{errors.general && (
								<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
									<i className="fas fa-exclamation-circle mr-2"></i>
									{errors.general}
								</div>
							)}

							<Input
								label="Email or Username"
								type="text"
								placeholder="name@company.com"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								error={errors.username}
								fullWidth
								required
							/>

							<Input
								label="Password"
								type={showPassword ? 'text' : 'password'}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								error={errors.password}
								fullWidth
								required
								endAdornment={
									<button
										type="button"
										className="focus:outline-none focus:text-indigo-600 transition-colors"
										onClick={() => setShowPassword(!showPassword)}
										tabIndex={-1}
									>
										<i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500 hover:text-gray-700`}></i>
									</button>
								}
							/>

							<div className="flex items-center justify-between">
								<Checkbox
									id="remember-me"
									label="Remember me"
									checked={rememberMe}
									onChange={(checked) => setRememberMe(checked)}
								/>

								<div className="text-sm">
									<Link
										to="/forgot-password"
										className="font-medium text-indigo-600 hover:text-indigo-500"
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<div>
								<Button
									type="submit"
									variant="primary"
									fullWidth
									loading={authLoading}
									className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
								>
									Sign in
								</Button>
							</div>
						</form>

						{/* Divider */}
						<div className="relative mt-6">
							<div className="absolute inset-0 flex items-center" aria-hidden="true">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-gray-50 lg:bg-white px-2 text-gray-500">Or continue with</span>
							</div>
						</div>

						{/* Social Login */}
						<div className="mt-6">
							<Button
								variant="outline"
								fullWidth
								icon={<i className="fab fa-google text-lg"></i>}
								onClick={handleGoogleLogin}
								className="justify-center"
							>
								Login with Google
							</Button>
						</div>

						{/* Footer / Sign Up Link */}
						<div className="mt-8 text-center">
							<p className="text-sm text-gray-600">
								Don't have an account?{' '}
								<Link
									to="/register"
									className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
								>
									Sign up for free
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
