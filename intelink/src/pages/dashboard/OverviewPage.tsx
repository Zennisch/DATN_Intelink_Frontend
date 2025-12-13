import { useAuth } from "../../hooks/useAuth";
import { useShortUrl } from "../../hooks/useShortUrl";
import { useEffect, useState } from "react";

const OverviewPage = () => {
	const { user, isLoading } = useAuth();
	const { getShortUrls, refreshSignal } = useShortUrl();
	const [totalUrls, setTotalUrls] = useState(0);

	useEffect(() => {
		const fetchTotalUrls = async () => {
			if (user) {
				try {
					const response = await getShortUrls({ page: 0, size: 1 });
					setTotalUrls(response.totalElements);
				} catch (error) {
					console.error("Failed to fetch total urls", error);
				}
			}
		};
		fetchTotalUrls();
	}, [user, refreshSignal, getShortUrls]);

	if (isLoading) {
		return (
			<div className="p-2 space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-gray-600">Loading...</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="p-2 space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-gray-600">No user data available</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-2 space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
						Dashboard
					</h1>
					<p className="text-gray-600 text-center">
						Welcome back, {user.profileName || user.username}!
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Quick Stats */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Quick Stats
						</h2>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Total Links:</span>
								<span className="font-medium">{totalUrls}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Total Clicks:</span>
								<span className="font-medium">{user.totalClicks}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Credit Balance:</span>
								<span className="font-medium">{user.balance} {user.currency}</span>
							</div>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Recent Activity
						</h2>
						<div className="text-sm text-gray-600">
							{user.lastLoginAt ? (
								<div>
									<div>Last login:</div>
									<div className="font-medium">
										{new Date(user.lastLoginAt).toLocaleString()}
									</div>
								</div>
							) : (
								<p>No recent activity</p>
							)}
						</div>
					</div>

					{/* Account Info */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Account Information
						</h2>
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2">
								{user.profilePictureUrl && (
									<img 
										src={user.profilePictureUrl} 
										alt="Profile" 
										className="w-8 h-8 rounded-full"
									/>
								)}
								<div>
									<div className="font-medium text-gray-900">
										{user.profileName || user.username}
									</div>
									<div className="text-gray-600">{user.email}</div>
								</div>
							</div>
							<div className="pt-2 space-y-1">
								<div className="text-gray-600">
									Plan: {user.currentSubscription?.planType || 'Free'}
								</div>
								<div className="text-gray-600">
									Links available: {(() => {
										const maxLinks = user.currentSubscription?.planDetails?.maxShortUrls || 10;
										const isUnlimited = maxLinks === -1;
										return isUnlimited 
											? `${totalUrls} (Unlimited)` 
											: `${totalUrls}/${maxLinks}`;
									})()}
								</div>
								<div className="text-gray-600">
									Member since: {new Date(user.createdAt).toLocaleDateString()}
								</div>
								<div className="text-gray-600">
									Status: <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
										user.status === 'ACTIVE' 
											? 'bg-green-100 text-green-800' 
											: 'bg-yellow-100 text-yellow-800'
									}`}>
										{user.status}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Subscription Info - if user has subscription */}
					{user.currentSubscription && (
						<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-3">
							<h2 className="text-lg font-semibold text-gray-900 mb-4">
								🎯 Current Subscription
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="bg-blue-50 p-4 rounded-lg">
									<div className="text-sm text-blue-600 font-medium">Plan Type</div>
									<div className="text-lg font-semibold text-blue-900">
										{user.currentSubscription.planType}
									</div>
									{/* <div className="text-xs text-blue-700">
										{user.currentSubscription.planDescription}
									</div> */}
								</div>
								<div className="bg-green-50 p-4 rounded-lg">
									<div className="text-sm text-green-600 font-medium">Status</div>
									<div className="text-lg font-semibold text-green-900">
										{user.currentSubscription.active ? 'Active' : 'Inactive'}
									</div>
									<div className="text-xs text-green-700">
										{user.currentSubscription.status}
									</div>
								</div>
								<div className="bg-purple-50 p-4 rounded-lg">
									<div className="text-sm text-purple-600 font-medium">Start Date</div>
									<div className="text-lg font-semibold text-purple-900">
										{new Date(user.currentSubscription.activatedAt || '').toLocaleDateString()}
									</div>
								</div>
								<div className="bg-orange-50 p-4 rounded-lg">
									<div className="text-sm text-orange-600 font-medium">Expires</div>
									<div className="text-lg font-semibold text-orange-900">
										{user.currentSubscription.expiresAt 
											? new Date(user.currentSubscription.expiresAt).toLocaleDateString() 
											: 'Never'}
									</div>
								</div>
							</div>
							<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
								<div className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${user.currentSubscription.planDetails.shortCodeCustomizationEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
									<span className={user.currentSubscription.planDetails.shortCodeCustomizationEnabled ? 'text-green-700' : 'text-gray-500'}>
										Custom Short Codes
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${user.currentSubscription.planDetails.statisticsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
									<span className={user.currentSubscription.planDetails.statisticsEnabled ? 'text-green-700' : 'text-gray-500'}>
										Statistics
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${user.currentSubscription.planDetails.apiAccessEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></span>
									<span className={user.currentSubscription.planDetails.apiAccessEnabled ? 'text-green-700' : 'text-gray-500'}>
										API Access
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Demo Section */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-3">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							🔒 Password Protection Feature
						</h2>
						<p className="text-gray-600 text-sm mb-4">
							Create short URLs with password protection for enhanced security.
						</p>
						<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
									<svg
										className="w-4 h-4 text-blue-600"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-blue-900 mb-1">
										How it works
									</h3>
									<ul className="text-sm text-blue-700 space-y-1">
										<li>• Create a short URL with password protection</li>
										<li>• Share the URL and password separately</li>
										<li>• Users will be redirected to `/shortCode/unlock` page</li>
										<li>• After entering correct password, they access the original URL</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
	);
};

export default OverviewPage;
