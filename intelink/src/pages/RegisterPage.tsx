import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Checkbox, Input } from "../components/primary";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // --- Placeholder Handlers ---
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    // Thu thập dữ liệu theo đúng model RegisterRequest
    const formData = new FormData(e.target as HTMLFormElement);
    const requestData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log("RegisterRequest Payload:", requestData);

    // Giả lập gọi API
    setTimeout(() => {
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    console.log("Redirecting to Google OAuth for Sign Up...");
  };

  const handleLoginRedirect = () => {
    console.log("Navigate to Login page...");
  };

  // --- Icons (Inline SVGs) ---
  const GoogleIcon = (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  const EyeIcon = (
    <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = (
    <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const LinkIcon = (
    <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  // Custom label for terms checkbox
  const termsLabel: ReactNode = (
    <span className="text-gray-600">
      I agree to the{" "}
      <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
        Terms of Service
      </a>{" "}
      and{" "}
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
               <span className="text-white">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
               </span>
             </div>
             <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
               Start your journey.
             </h1>
             <p className="text-lg text-indigo-100 max-w-md">
               Join thousands of developers and marketers building smarter connections with Intelink.
             </p>
          </div>
          
          {/* Feature List instead of Testimonial for Register Page */}
          <div className="space-y-4">
            {[
              "Unlimited custom short links",
              "Advanced analytics & tracking",
              "Team collaboration features"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-indigo-100">
                <div className="h-6 w-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Right Column: Register Form --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            {LinkIcon}
            <span className="text-2xl font-bold text-gray-900">Intelink</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Get started with your free 14-day trial.
            </p>
          </div>

          <div className="mt-8">
            {/* Social Sign Up */}
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                fullWidth
                icon={GoogleIcon}
                onClick={handleGoogleSignUp}
                className="justify-center"
              >
                Sign up with Google
              </Button>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-50 lg:bg-white px-2 text-gray-500">
                  Or register with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <div className="mt-6">
              <form onSubmit={handleRegister} className="space-y-5">
                <Input
                  label="Username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  fullWidth
                  required
                  autoComplete="username"
                />

                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  fullWidth
                  required
                  autoComplete="email"
                />

                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
                      {showPassword ? EyeOffIcon : EyeIcon}
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
                    loading={isLoading}
                    disabled={!agreedToTerms}
                    className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
                  >
                    Create account
                  </Button>
                </div>
              </form>
            </div>

            {/* Footer / Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={handleLoginRedirect}
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}