import { useState, type FormEvent } from "react";
import { Button, Input } from "../components/primary";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State quản lý visibility của mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State quản lý validation lỗi
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // --- Placeholder Handlers ---
  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation cơ bản
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const requestPayload = {
      password,
      confirmPassword
    };

    console.log("ResetPasswordRequest Payload:", requestPayload);

    // Giả lập gọi API
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleGoToLogin = () => {
    console.log("Navigate to Login page...");
  };

  // --- Icons ---
  const LockResetIcon = (
    <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const CheckCircleIcon = (
    <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
               <span className="text-white">
                 <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </span>
             </div>
             <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
               Safety first.
             </h1>
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
            {LinkIcon}
            <span className="text-2xl font-bold text-gray-900">Intelink</span>
          </div>

          {!isSuccess ? (
            // --- FORM VIEW ---
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  {LockResetIcon}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Set new password
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your new password must be different to previously used passwords.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <Input
                  label="New Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
                      {showPassword ? EyeOffIcon : EyeIcon}
                    </button>
                  }
                />

                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  fullWidth
                  required
                  error={passwordError}
                  onChange={() => setPasswordError(null)} // Clear error on typing
                  endAdornment={
                    <button
                      type="button"
                      className="focus:outline-none focus:text-indigo-600 transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? EyeOffIcon : EyeIcon}
                    </button>
                  }
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500"
                >
                  Reset password
                </Button>
              </form>
            </div>
          ) : (
            // --- SUCCESS VIEW ---
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto flex items-center justify-center mb-6">
                {CheckCircleIcon}
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                Password reset
              </h2>
              
              <p className="text-gray-600 mb-8">
                Your password has been successfully reset. <br/>
                Click below to log in securely.
              </p>

              <Button
                variant="primary"
                fullWidth
                onClick={handleGoToLogin}
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