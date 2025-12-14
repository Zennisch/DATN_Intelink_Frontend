import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/primary';
import { useAuth } from '../hooks/useAuth';
import { useShortUrl } from '../hooks/useShortUrl';
import { LogoBadge } from '../components/etc/LogoBadge';

// Icon components (SVG) để trang trí
const StatsIcon = () => (
  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const ZapIcon = () => (
  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function HomePage() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading: authLoading } = useAuth();
	const { createShortUrl, isLoading: shortUrlLoading } = useShortUrl();

	const [originalUrl, setOriginalUrl] = useState('');
	const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			navigate('/dashboard');
		}
	}, [isAuthenticated, authLoading, navigate]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setShortenedUrl(null);

		if (!originalUrl.trim()) {
			setError('Please enter a URL');
			return;
		}

		try {
			const response = await createShortUrl({ originalUrl });
			const fullUrl = response.shortUrl || `${window.location.origin}/${response.shortCode}`;
			setShortenedUrl(fullUrl);
		} catch (err: any) {
			console.error('Failed to shorten URL:', err);
			setError(err.response?.data?.message || 'Failed to shorten URL. Please try again.');
		}
	};

	const handleCopy = () => {
		if (shortenedUrl) {
			navigator.clipboard.writeText(shortenedUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	if (authLoading) return null;

	return (
		<div className="min-h-screen bg-white overflow-hidden relative selection:bg-indigo-500 selection:text-white">
			{/* Background Decoration (Blobs) */}
			<div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
				<div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
				<div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
			</div>

			{/* Navbar */}
			<nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				<div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
					<LogoBadge />
					<span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
						ShortLink
					</span>
				</div>
				<div className="flex items-center gap-4">
					<button 
						onClick={() => navigate('/login')}
						className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
					>
						Sign in
					</button>
					<Button 
						onClick={() => navigate('/register')}
						variant="primary"
						className="rounded-full px-6 shadow-lg shadow-indigo-500/30"
					>
						Get Started
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<main className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					
					{/* Main Heading */}
					<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
						Shorten Your Links, <br />
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
							Expand Your Reach
						</span>
					</h1>
					
					<p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
						Transform long, ugly links into short, memorable ones. 
						Track clicks and analyze your audience with our powerful dashboard.
					</p>

					{/* Shortener Card */}
					<div className="max-w-3xl mx-auto">
						<div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 sm:p-4">
							<form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
								<div className="flex-grow relative">
									<Input
										label="" // Empty label for clean look
										type="url"
										placeholder="Paste your long URL here (e.g., https://super-long-site.com/...)"
										value={originalUrl}
										onChange={(e) => setOriginalUrl(e.target.value)}
										required
										fullWidth
										error={error}
										className="h-14 text-lg border-transparent bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl"
									/>
								</div>
								<Button
									type="submit"
									variant="primary"
									loading={shortUrlLoading}
									disabled={shortUrlLoading}
									className="h-auto min-h-[56px] px-8 text-lg font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
								>
									Shorten It!
								</Button>
							</form>

							{/* Result Area */}
							{shortenedUrl && (
								<div className="mt-4 p-4 bg-green-50/80 rounded-xl border border-green-200 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
									<div className="flex-grow text-left">
										<p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">Success!</p>
										<p className="text-lg text-gray-800 font-medium truncate pr-4">{shortenedUrl}</p>
									</div>
									<Button
										variant={copied ? "secondary" : "outline"}
										onClick={handleCopy}
										className={`min-w-[100px] ${copied ? 'bg-green-200 text-green-800 border-green-200' : 'bg-white'}`}
									>
										{copied ? 'Copied!' : 'Copy URL'}
									</Button>
								</div>
							)}
						</div>

						<p className="mt-4 text-sm text-gray-500">
							By clicking Shorten, you agree to our <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
						</p>
					</div>
				</div>

				{/* Feature Grid (To make it look like a real product) */}
				<div className="mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
								<ZapIcon />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Lightning Fast</h3>
							<p className="text-gray-500">Instant redirection with our globally distributed infrastructure.</p>
						</div>
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
								<ShieldIcon />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Reliable</h3>
							<p className="text-gray-500">HTTPS encryption and malware protection to keep your users safe.</p>
						</div>
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
							<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
								<StatsIcon />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Analytics</h3>
							<p className="text-gray-500">Track clicks, locations, and devices with our detailed dashboard.</p>
						</div>
					</div>
				</div>
			</main>

			{/* Simple Footer */}
			<footer className="relative z-10 py-8 border-t border-gray-100 mt-12 bg-white/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
					&copy; {new Date().getFullYear()} ShortLink Service. All rights reserved.
				</div>
			</footer>

			{/* CSS for custom animation if not in tailwind config */}
			<style>{`
				@keyframes blob {
					0% { transform: translate(0px, 0px) scale(1); }
					33% { transform: translate(30px, -50px) scale(1.1); }
					66% { transform: translate(-20px, 20px) scale(0.9); }
					100% { transform: translate(0px, 0px) scale(1); }
				}
				.animate-blob {
					animation: blob 7s infinite;
				}
				.animation-delay-2000 {
					animation-delay: 2s;
				}
				.animation-delay-4000 {
					animation-delay: 4s;
				}
			`}</style>
		</div>
	);
}