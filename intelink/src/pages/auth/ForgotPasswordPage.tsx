import { useState, type FormEvent } from "react";
import { Button, Input } from "../../components/primary";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  // --- Placeholder Handlers ---
  const handleResetRequest = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    console.log("ForgotPasswordRequest Payload:", { email });

    // Giả lập gọi API
    setTimeout(() => {
      setSubmittedEmail(email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleBackToLogin = () => {
    console.log("Navigate back to Login page...");
  };

  const handleResend = () => {
    console.log("Resending email to:", submittedEmail);
    alert(`Reset link resent to ${submittedEmail}`);
  };

  // --- Icons ---
  const KeyIcon = (
    <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 17 6 22.464 4.464 21l-.536-.536 2.828-2.828-2.292-2.292 2.828-2.828.536.536L17 11.536A6 6 0 0121 9z" />
    </svg>
  );

  const ArrowLeftIcon = (
    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const MailIcon = (
    <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LinkIcon = (
    <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

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
               <span className="text-white">
                 <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </span>
             </div>
             <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
               Secure & Reliable.
             </h1>
             <p className="text-lg text-slate-300 max-w-md">
               Don't worry, it happens to the best of us. We'll help you recover your access in no time so you can get back to managing your links.
             </p>
          </div>
        </div>
      </div>

      {/* --- Right Column: Form Area --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 lg:bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            {LinkIcon}
            <span className="text-2xl font-bold text-gray-900">Intelink</span>
          </div>

          {/* Conditional Rendering: Form vs Success Message */}
          {!isSubmitted ? (
            // --- STATE 1: Input Form ---
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                  {KeyIcon}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Forgot password?
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleResetRequest} className="space-y-6">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  fullWidth
                  required
                  autoComplete="email"
                  autoFocus
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

              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToLogin}
                  className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {ArrowLeftIcon}
                  Back to log in
                </button>
              </div>
            </div>
          ) : (
            // --- STATE 2: Success Message ---
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                {MailIcon}
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                Check your email
              </h2>
              
              <p className="text-gray-600 mb-8">
                We sent a password reset link to <br/>
                <span className="font-medium text-gray-900">{submittedEmail}</span>
              </p>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => window.open("mailto:", "_blank")}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Open email app
                </Button>

                <p className="text-sm text-gray-500">
                  Didn't receive the email?{" "}
                  <button 
                    onClick={handleResend}
                    className="text-indigo-600 font-medium hover:text-indigo-500"
                  >
                    Click to resend
                  </button>
                </p>

                <div className="pt-4">
                   <button
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {ArrowLeftIcon}
                    Back to log in
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}