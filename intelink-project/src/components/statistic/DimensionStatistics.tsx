import React, { useState } from "react";
import { DimensionType, DIMENSION_CATEGORIES } from "../../types/statistics";
import { useStatistics } from "../../hooks/useStatistics";
import { StatisticsChart } from "./StatisticsChart";
import { DimensionSelector } from "./DimensionSelector";
import { StatisticsTable } from "./StatisticsTable";

interface DimensionStatisticsProps {
	shortcode: string;
}

export const DimensionStatistics: React.FC<DimensionStatisticsProps> = ({
	shortcode,
}) => {
	const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>([
		DimensionType.BROWSER,
	]);
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

	// Create list of all dimensions when selecting All
	const allDimensions = Object.values(DIMENSION_CATEGORIES).flat();
	const dimensionsToFetch = isAllSelected ? allDimensions : selectedDimensions;

	const { data, loading, error, refetch } = useStatistics(
		shortcode,
		dimensionsToFetch,
	);

	const handleDimensionChange = (dimensions: DimensionType[]) => {
		setSelectedDimensions(dimensions);
		if (dimensions.length === 0) {
			setIsAllSelected(false);
		}
	};

	const handleAllToggle = () => {
		if (isAllSelected) {
			// If currently selecting All, switch to individual
			setIsAllSelected(false);
			setSelectedDimensions([DimensionType.BROWSER]); // Default selection
		} else {
			// If not selected All yet, select all
			setIsAllSelected(true);
			setSelectedDimensions([]); // Clear individual selections
		}
	};

	if (loading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
					<div className="h-64 bg-gray-200 rounded"></div>
					<div className="h-96 bg-gray-200 rounded"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center">
						<svg
							className="w-5 h-5 text-red-400 mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="text-red-800">Error loading statistics: {error}</span>
					</div>
					<button
						onClick={() => refetch()}
						className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Collapsible Dimension Selector */}
			<div className="bg-white rounded-lg border border-gray-200">
				<div 
					className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
					onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
				>
					<div className="flex items-center space-x-3">
						<h3 className="text-lg font-semibold text-gray-900">
							Statistics Filters
						</h3>
						<span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
							{isAllSelected 
								? `All (${Object.values(DIMENSION_CATEGORIES).flat().length})`
								: `${selectedDimensions.length} selected`
							}
						</span>
					</div>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-500">
							{isFilterPanelOpen ? 'Hide' : 'Show'} Filters
						</span>
						<button 
							className="p-1 rounded hover:bg-gray-200 transition-colors"
							onClick={(e) => {
								e.stopPropagation();
								setIsFilterPanelOpen(!isFilterPanelOpen);
							}}
						>
							<svg 
								className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
									isFilterPanelOpen ? 'rotate-180' : ''
								}`} 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={2} 
									d="M19 9l-7 7-7-7" 
								/>
							</svg>
						</button>
					</div>
				</div>
				
				{isFilterPanelOpen && (
					<div className="border-t border-gray-200 p-6 animate-in slide-in-from-top-2 duration-200">
						<DimensionSelector
							selectedDimensions={selectedDimensions}
							onDimensionChange={handleDimensionChange}
							isAllSelected={isAllSelected}
							onAllToggle={handleAllToggle}
						/>
					</div>
				)}
			</div>

			{data && Object.keys(data).length > 0 ? (
				<>
					{/* Chart Type Selector */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Visual Analytics
							</h3>
							<div className="flex bg-gray-100 rounded-lg p-1">
								<button
									onClick={() => setChartType("bar")}
									className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
										chartType === "bar"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									Bar Chart
								</button>
								<button
									onClick={() => setChartType("doughnut")}
									className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
										chartType === "doughnut"
											? "bg-white text-gray-900 shadow-sm"
											: "text-gray-600 hover:text-gray-900"
									}`}
								>
									Doughnut Chart
								</button>
							</div>
						</div>
						
						{/* Charts Grid */}
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{Object.entries(data).map(([dimensionType, dimensionData]) => {
								if (dimensionData.data.length > 0) {
									return (
										<StatisticsChart
											key={dimensionType}
											data={dimensionData.data}
											title={getDimensionTitle(dimensionType as DimensionType)}
											chartType={chartType}
										/>
									);
								}
								return null;
							})}
						</div>
					</div>

					{/* Statistics Tables */}
					<div className="bg-white rounded-lg border border-gray-200 p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Detailed Statistics
						</h3>
						<div className="space-y-6">
							{Object.entries(data).map(([dimensionType, dimensionData]) => (
								<StatisticsTable
									key={`table-${dimensionType}`}
									data={dimensionData.data}
									title={getDimensionTitle(dimensionType as DimensionType)}
								/>
							))}
						</div>
					</div>
				</>
			) : (
				<div className="bg-white rounded-lg border border-gray-200 p-8">
					<div className="text-center text-gray-500">
						No data available for selected dimensions
					</div>
				</div>
			)}
		</div>
	);

	// Helper function to get dimension titles
	function getDimensionTitle(dimensionType: DimensionType): string {
		const titles: Record<DimensionType, string> = {
			[DimensionType.REFERRER]: "Referrer",
			[DimensionType.REFERRER_TYPE]: "Referrer Type",
			[DimensionType.UTM_SOURCE]: "UTM Source",
			[DimensionType.UTM_MEDIUM]: "UTM Medium",
			[DimensionType.UTM_CAMPAIGN]: "UTM Campaign",
			[DimensionType.UTM_TERM]: "UTM Term",
			[DimensionType.UTM_CONTENT]: "UTM Content",
			[DimensionType.COUNTRY]: "Country",
			[DimensionType.REGION]: "Region",
			[DimensionType.CITY]: "City",
			[DimensionType.TIMEZONE]: "Timezone",
			[DimensionType.BROWSER]: "Browser",
			[DimensionType.OS]: "Operating System",
			[DimensionType.DEVICE_TYPE]: "Device Type",
			[DimensionType.ISP]: "Internet Service Provider",
			[DimensionType.LANGUAGE]: "Language",
			[DimensionType.CUSTOM]: "Custom",
		};
		return titles[dimensionType] || dimensionType;
	}
};
