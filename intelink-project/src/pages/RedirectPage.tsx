import React from "react";
import { useParams, Link } from "react-router-dom";
import icon from "../assets/icon.png";

const RedirectPage: React.FC = () => {
	const { shortCode } = useParams<{ shortCode: string }>();

	// This component handles direct redirects to short URLs
	// In a real app, this would be handled by the backend redirect
	React.useEffect(() => {
		if (shortCode) {
			// Redirect to backend endpoint which will handle the actual redirect
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			window.location.href = `${backendUrl}/${shortCode}`;
		}
	}, [shortCode]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<img src={icon} alt="Intelink Logo" className="w-16 h-16" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900">Intelink</h1>
				</div>

				<div className="bg-white rounded-xl shadow-lg p-8 text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Redirecting...
					</h2>
					<p className="text-gray-600 text-sm mb-6">
						You will be redirected to the destination in a moment.
					</p>
					<Link 
						to="/" 
						className="text-blue-600 hover:text-blue-700 text-sm font-medium"
					>
						← Back to Intelink
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RedirectPage;
