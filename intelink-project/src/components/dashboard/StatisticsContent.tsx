import React, { useState } from "react";
import { UrlListSidebar } from "../statistic/UrlListSidebar.tsx";
import { StatisticsTabs, type StatisticsTab } from "../statistic/StatisticsTabs.tsx";
import { TimeStatistics } from "../statistic/TimeStatistics.tsx";
import { LocationStatistics } from "../statistic/LocationStatistics.tsx";
import { DimensionStatistics } from "../statistic/DimensionStatistics.tsx";
import type { ShortUrlListResponse } from "../../dto/response/ShortUrlResponse.ts";

export const StatisticsContent: React.FC = () => {
	const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<StatisticsTab>("location");

	const handleUrlSelect = (shortCode: string, urlData: ShortUrlListResponse) => {
		setSelectedUrl(shortCode);
		// Reset to location tab when selecting a new URL (since time is disabled)
		setActiveTab("location");
		// Store urlData for potential future use
		console.log("Selected URL data:", urlData);
	};

	const renderTabContent = () => {
		if (!selectedUrl) return null;

		switch (activeTab) {
			case "time":
				return <TimeStatistics shortcode={selectedUrl} />;
			case "location":
				return <LocationStatistics shortcode={selectedUrl} />;
			case "dimension":
				return <DimensionStatistics shortcode={selectedUrl} />;
			default:
				return null;
		}
	};

	return (
		<div className="h-full flex bg-gray-50 rounded-lg overflow-hidden">
			{/* Left Sidebar - URL List */}
			<UrlListSidebar
				selectedUrl={selectedUrl}
				onUrlSelect={handleUrlSelect}
			/>

			{/* Right Content - Statistics */}
			<div className="flex-1 flex flex-col">
				{/* Header with Tabs */}
				<StatisticsTabs
					activeTab={activeTab}
					onTabChange={setActiveTab}
					selectedUrl={selectedUrl}
				/>

				{/* Content Area */}
				<div className="flex-1 overflow-y-auto bg-gray-50">
					{selectedUrl ? (
						renderTabContent()
					) : (
						<div className="p-6">
							<div className="bg-white rounded-lg border border-gray-200 p-8">
								<div className="text-center">
									<svg
										className="mx-auto h-16 w-16 text-gray-400 mb-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Welcome to Analytics Dashboard
									</h3>
									<p className="text-gray-600 mb-6 max-w-md mx-auto">
										Select a URL from the sidebar to view detailed analytics including 
										location data, dimension breakdowns, and more.
									</p>
									<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
										<h4 className="font-medium text-blue-900 mb-2">Available Analytics:</h4>
										<ul className="text-sm text-blue-800 space-y-1">
											<li>• Geographic visitor distribution</li>
											<li>• Device and browser breakdowns</li>
											<li>• Traffic source analysis</li>
											<li>• UTM parameter tracking</li>
											<li>• Time-based analytics (coming soon)</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
