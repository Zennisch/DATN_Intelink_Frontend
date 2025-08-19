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
			disabled: true, // Backend not ready yet
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
						d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
			description: "View statistics by dimensions with filters",
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
			<div className="px-6 py-4">
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Statistics Dashboard
				</h1>
				<p className="text-gray-600">
					Analyzing statistics for: <span className="font-medium">{selectedUrl}</span>
				</p>
			</div>
			
			<div className="px-6">
				<nav className="flex space-x-8" aria-label="Tabs">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => !tab.disabled && onTabChange(tab.id)}
							disabled={tab.disabled}
							className={`
								group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
								${
									activeTab === tab.id
										? "border-blue-500 text-blue-600"
										: tab.disabled
										? "border-transparent text-gray-400 cursor-not-allowed"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
								}
							`}
							title={tab.disabled ? "Feature coming soon" : tab.description}
						>
							<span className={`mr-2 ${tab.disabled ? "opacity-50" : ""}`}>
								{tab.icon}
							</span>
							{tab.name}
							{tab.disabled && (
								<span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
									Soon
								</span>
							)}
						</button>
					))}
				</nav>
			</div>
		</div>
	);
};
