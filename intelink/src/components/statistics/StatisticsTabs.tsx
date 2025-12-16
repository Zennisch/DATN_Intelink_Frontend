import React from "react";

export type StatisticsTab = "time" | "location" | "dimension";

interface StatisticsTabsProps {
	activeTab: StatisticsTab;
	onTabChange: (tab: StatisticsTab) => void;
	selectedUrl: string | null;
}

export const StatisticsTabs: React.FC<StatisticsTabsProps> = ({
	activeTab,
	onTabChange,
	selectedUrl,
}) => {
	const tabs = [
		{
			id: "time" as StatisticsTab,
			name: "Time",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			description: "View statistics over time",
			disabled: false,
		},
		{
			id: "location" as StatisticsTab,
			name: "Location",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			description: "View statistics by location",
			disabled: false,
		},
		{
			id: "dimension" as StatisticsTab,
			name: "Dimension",
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
			),
			description: "View statistics by dimensions (Browser, OS, Device, Location)",
			disabled: false,
		},
	];

	if (!selectedUrl) {
		return (
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="text-center py-8">
					<svg
						className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						Select a URL to View Statistics
					</h3>
					<p className="text-gray-500">
						Choose a URL from the sidebar to see detailed analytics
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border-b border-gray-200">
			<div className="flex overflow-x-auto">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => !tab.disabled && onTabChange(tab.id)}
						disabled={tab.disabled}
						className={`
							flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
							${
								activeTab === tab.id
									? "border-blue-500 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}
							${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
						`}
					>
						<span className="mr-2">{tab.icon}</span>
						{tab.name}
					</button>
				))}
			</div>
		</div>
	);
};
