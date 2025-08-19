import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDashboard } from "../../contexts/DashboardContext";
import { ShortUrlContent } from "./ShortUrlContent";
import { StatisticsContent } from "./StatisticsContent";

export const SinglePageDashboard: React.FC = () => {
	const { activeView, setActiveView } = useDashboard();
	const [searchParams, setSearchParams] = useSearchParams();

	// Handle URL parameter for view
	useEffect(() => {
		const viewParam = searchParams.get("view");
		if (viewParam && (viewParam === "overview" || viewParam === "short-urls" || viewParam === "statistics")) {
			setActiveView(viewParam);
			// Remove the view parameter from URL to keep it clean
			setSearchParams({});
		}
	}, [searchParams, setActiveView, setSearchParams]);

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
			{/* Content Area */}
			<div className="p-6">{renderContent()}</div>
		</div>
	);
};
