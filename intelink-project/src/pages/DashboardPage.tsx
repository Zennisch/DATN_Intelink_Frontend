import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";

function DashboardPage() {
	return (
		<AuthenticatedLayout>
			<div>
				<h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Dashboard content will go here */}
					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome!</h2>
						<p className="text-gray-600">
							Welcome to your dashboard. Here you can manage your links, view analytics, and more.
						</p>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Stats</h2>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Total Links:</span>
								<span className="font-medium">0</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Total Clicks:</span>
								<span className="font-medium">0</span>
							</div>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
						<h2 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h2>
						<p className="text-gray-600 text-sm">No recent activity</p>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}

export default DashboardPage;
