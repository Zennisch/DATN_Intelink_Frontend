import { useState, type FormEvent } from "react";
import { Button, Checkbox, Input } from "../components/primary";

// Icons (Sử dụng SVG trực tiếp để không phụ thuộc thư viện ngoài)
const Icons = {
	Google: () => (
		<svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				fill="#4285F4"
			/>
			<path
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				fill="#34A853"
			/>
			<path
				d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
				fill="#FBBC05"
			/>
			<path
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				fill="#EA4335"
			/>
		</svg>
	),
	Logo: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-8 h-8 text-indigo-500"
		>
			<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
			<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
		</svg>
	),
	Eye: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="w-5 h-5 text-gray-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
			/>
		</svg>
	),
	EyeOff: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="w-5 h-5 text-gray-500"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
			/>
		</svg>
	),
};

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		rememberMe: false,
	});

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		
		// Simulate API call
		console.log("Logging in with:", formData);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		
		setIsLoading(false);
	};

	const handleGoogleLogin = () => {
		console.log("Redirecting to Google OAuth...");
	};

	const handleSignUpRedirect = () => {
		console.log("Navigating to Sign Up page...");
	};

	const handleForgotPassword = () => {
		console.log("Navigating to Forgot Password page...");
	};

	return (
		<div className="min-h-screen flex bg-white">
			{/* Left Side - Branding & Visuals (Hidden on Mobile) */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden flex-col justify-between p-12 text-white">
				{/* Abstract Background Pattern */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
						<path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
						<circle cx="20" cy="30" r="1" fill="currentColor" />
						<circle cx="80" cy="70" r="2" fill="currentColor" />
						<path d="M0 0 L 100 100" stroke="currentColor" strokeWidth="0.5" />
					</svg>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-gray-900/40 to-gray-900"></div>
				</div>

				{/* Logo Area */}
				<div className="relative z-10 flex items-center gap-3">
					<div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
						<Icons.Logo />
					</div>
					<span className="text-2xl font-bold tracking-tight">Intelink</span>
				</div>

				{/* Hero Text */}
				<div className="relative z-10 max-w-md">
					<h1 className="text-4xl font-bold mb-6 leading-tight">
						Shorten URLs, <br />
						<span className="text-indigo-400">Expand Reach.</span>
					</h1>
					<p className="text-gray-400 text-lg leading-relaxed">
						Join thousands of marketers and developers who use Intelink to track, optimize, and manage their links intelligently.
					</p>
				</div>

				{/* Footer/Copyright */}
				<div className="relative z-10 text-sm text-gray-500">
					© {new Date().getFullYear()} Intelink Inc. All rights reserved.
				</div>
			</div>

			{/* Right Side - Login Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24">
				<div className="w-full max-w-md space-y-8">
					{/* Header (Mobile Logo visible only here) */}
					<div className="text-center lg:text-left">
						<div className="lg:hidden flex justify-center mb-6">
							<div className="bg-gray-900 p-2 rounded-xl">
								<Icons.Logo />
							</div>
						</div>
						<h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
						<p className="mt-2 text-gray-500">
							Please enter your details to sign in.
						</p>
					</div>

					<form onSubmit={handleLogin} className="space-y-6 mt-8">
						{/* Email Field */}
						<Input
							id="email"
							type="email"
							label="Email or Username"
							placeholder="name@company.com"
							required
							fullWidth
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
							autoComplete="username"
						/>

						{/* Password Field with Custom Toggle Layout */}
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								label="Password"
								placeholder="••••••••"
								required
								fullWidth
								value={formData.password}
								onChange={(e) => setFormData({ ...formData, password: e.target.value })}
								autoComplete="current-password"
								inputClassName="pr-10" // Make space for the eye icon
							/>
							<button
								type="button"
								className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
								onClick={() => setShowPassword(!showPassword)}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
							</button>
						</div>

						{/* Remember Me & Forgot Password */}
						<div className="flex items-center justify-between">
							<Checkbox
								id="remember-me"
								label="Remember me"
								checked={formData.rememberMe}
								onChange={(checked) => setFormData({ ...formData, rememberMe: checked })}
							/>
							
							<button
								type="button"
								onClick={handleForgotPassword}
								className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
							>
								Forgot password?
							</button>
						</div>

						{/* Submit Button */}
						<Button
							type="submit"
							variant="primary"
							fullWidth
							size="lg"
							loading={isLoading}
						>
							Sign in
						</Button>

						{/* Divider */}
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-gray-500">Or continue with</span>
							</div>
						</div>

						{/* Google Login Button */}
						<Button
							type="button"
							variant="outline"
							fullWidth
							size="lg"
							onClick={handleGoogleLogin}
							icon={<Icons.Google />}
							iconPosition="left"
							className="font-normal text-gray-600"
						>
							Google
						</Button>
					</form>

					{/* Footer Sign Up Link */}
					<p className="text-center text-sm text-gray-500 mt-8">
						Don't have an account?{" "}
						<button
							type="button"
							onClick={handleSignUpRedirect}
							className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors focus:outline-none focus:underline"
						>
							Sign up for free
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}