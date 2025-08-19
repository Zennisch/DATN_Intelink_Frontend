import React from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { ShortUrlContent } from "./ShortUrlContent";
import { StatisticsContent } from "./StatisticsContent";

interface MenuItem {
	id: "overview" | "short-urls" | "statistics";
	label: string;
	icon: string;
	description: string;
}

const menuItems: MenuItem[] = [
	{
		id: "overview",
		label: "Overview",
		icon: "📊",
		description: "View account overview and activities",
	},
	{
		id: "short-urls",
		label: "Short URLs",
		icon: "🔗",
		description: "Manage and create short URLs",
	},
	{
		id: "statistics",
		label: "Statistics",
		icon: "📈",
		description: "View access statistics and analytics",
	},
];

export const SinglePageDashboard: React.FC = () => {
	const { activeView, setActiveView } = useDashboard();

	const renderContent = () => {
		switch (activeView) {
			case "overview":
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

							{/* Quick Actions */}
							<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">
									Quick Actions
								</h2>
								<div className="space-y-3">
									<button
										onClick={() => setActiveView("short-urls")}
										className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
									>
										🔗 Create New Short URL
									</button>
									<button
										onClick={() => setActiveView("statistics")}
										className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
									>
										📈 View Statistics
									</button>
								</div>
							</div>

							{/* Recent Activity */}
							<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
								<h2 className="text-lg font-semibold text-gray-900 mb-2">
									Recent Activity
								</h2>
								<p className="text-gray-600 text-sm">No recent activity</p>
							</div>
						</div>

						{/* Navigation Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
							<div
								onClick={() => setActiveView("short-urls")}
								className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200"
							>
								<div className="text-white">
									<div className="text-3xl mb-2">🔗</div>
									<h3 className="text-xl font-semibold mb-2">
										Manage Short URLs
									</h3>
									<p className="text-blue-100">
										Create, edit and manage your short URLs
									</p>
								</div>
							</div>

							<div
								onClick={() => setActiveView("statistics")}
								className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200"
							>
								<div className="text-white">
									<div className="text-3xl mb-2">📈</div>
									<h3 className="text-xl font-semibold mb-2">View Statistics</h3>
									<p className="text-green-100">
										Analyze traffic and performance of your links
									</p>
								</div>
							</div>
						</div>
					</div>
				);

			case "short-urls":
				return (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold text-gray-900">
								Manage Short URLs
							</h1>
						</div>
						<ShortUrlContent />
					</div>
				);

			case "statistics":
				return (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
						</div>
						<StatisticsContent />
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Top Navigation */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center space-x-6">
					{menuItems.map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveView(item.id)}
							className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
								activeView === item.id
									? "bg-blue-100 text-blue-700 border border-blue-200"
									: "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
							}`}
						>
							<span className="text-lg">{item.icon}</span>
							<span className="font-medium">{item.label}</span>
						</button>
					))}
				</div>
			</div>

			{/* Content Area */}
			<div className="p-6">{renderContent()}</div>
		</div>
	);
};
