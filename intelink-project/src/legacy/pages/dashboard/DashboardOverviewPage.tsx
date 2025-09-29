export const DashboardOverviewPage = () => {
	return (
		<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Dashboard
					</h1>
					<p className="text-gray-600">
						Welcome to your Intelink dashboard
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
								<span className="font-medium">0</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Total Clicks:</span>
								<span className="font-medium">0</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Active Links:</span>
								<span className="font-medium">0</span>
							</div>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Recent Activity
						</h2>
						<p className="text-gray-600 text-sm">No recent activity</p>
					</div>

					{/* Account Info */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">
							Account Information
						</h2>
						<div className="space-y-2 text-sm text-gray-600">
							<div>Plan: Free</div>
							<div>Links available: 2/10</div>
							<div>Member since: Today</div>
						</div>
					</div>

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
