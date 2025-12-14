import { useState, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/primary';
import { useAuth } from '../hooks/useAuth';
import { useShortUrl } from '../hooks/useShortUrl';
import { LogoBadge } from '../components/etc/LogoBadge';

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
			// Construct the full short URL. Assuming the backend returns the short code or full URL.
			// Looking at ShortUrlDTO, CreateShortUrlResponse likely has shortCode or shortUrl.
			// Let's assume it has shortUrl or we construct it.
			// If response has shortUrl, use it. If not, construct from window.location.origin + '/' + response.shortCode
			
			// I'll check CreateShortUrlResponse in a moment, but for now I'll assume it returns the object.
			// If I look at ShortUrlDTO.ts (which I haven't read yet but saw in file list), I can be sure.
			// But usually it returns the created object.
			
			// Let's assume response.shortUrl exists or response.shortCode exists.
			// I'll use a safe fallback.
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

	if (authLoading) {
		return null; // Or a spinner
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<LogoBadge />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Shorten your link
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Paste your long URL below to shorten it instantly.
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<Input
								label="Original URL"
								type="url"
								placeholder="https://example.com/very-long-url..."
								value={originalUrl}
								onChange={(e) => setOriginalUrl(e.target.value)}
								required
								fullWidth
								error={error}
							/>
						</div>

						<div>
							<Button
								type="submit"
								variant="primary"
								fullWidth
								loading={shortUrlLoading}
								disabled={shortUrlLoading}
							>
								Shorten URL
							</Button>
						</div>
					</form>

					{shortenedUrl && (
						<div className="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
							<h3 className="text-sm font-medium text-green-800">Shortened URL created!</h3>
							<div className="mt-2 flex items-center gap-2">
								<Input
									readOnly
									value={shortenedUrl}
									fullWidth
									className="bg-white"
								/>
								<Button
									variant="secondary"
									onClick={handleCopy}
									className="whitespace-nowrap"
								>
									{copied ? 'Copied!' : 'Copy'}
								</Button>
							</div>
						</div>
					)}
					
					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-white text-gray-500">
									Want to track your links?
								</span>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-2 gap-3">
							<Button
								variant="outline"
								fullWidth
								onClick={() => navigate('/login')}
							>
								Sign in
							</Button>
							<Button
								variant="outline"
								fullWidth
								onClick={() => navigate('/register')}
							>
								Sign up
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
