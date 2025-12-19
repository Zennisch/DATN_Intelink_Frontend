import React, { useState, useEffect } from "react";
import { StatisticsService, type DimensionType } from "../../services/StatisticsService";
import { StatisticsChart } from "./StatisticsChart";
import { DimensionSelector, DIMENSION_CATEGORIES } from "./DimensionSelector";
import { StatisticsTable } from "./StatisticsTable";
import type { DimensionStatResponse, GeographyStatResponse } from "../../dto/StatisticsDTO";

interface DimensionStatisticsProps {
	shortcode: string;
}

// Helper to fetch data based on dimension type
const fetchDimensionData = async (shortcode: string, type: DimensionType) => {
    switch (type) {
        case 'BROWSER': return StatisticsService.getBrowserStats(shortcode);
        case 'OS': return StatisticsService.getOsStats(shortcode);
        case 'DEVICE_TYPE': return StatisticsService.getDeviceStats(shortcode);
        case 'CITY': return StatisticsService.getCityStats(shortcode);
        case 'COUNTRY': return StatisticsService.getCountryStats(shortcode);
        default: throw new Error(`Unsupported dimension: ${type}`);
    }
};

export const DimensionStatistics: React.FC<DimensionStatisticsProps> = ({
	shortcode,
}) => {
	const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>([
		"BROWSER",
	]);
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");
	const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    
    const [data, setData] = useState<Record<string, DimensionStatResponse | GeographyStatResponse>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Create list of all dimensions when selecting All
	const allDimensions = Object.values(DIMENSION_CATEGORIES).flat();
	const dimensionsToFetch = isAllSelected ? allDimensions : selectedDimensions;

    useEffect(() => {
        const fetchData = async () => {
            if (!shortcode || dimensionsToFetch.length === 0) return;
            setLoading(true);
            setError(null);
            try {
                const promises = dimensionsToFetch.map(async (type) => {
                    const result = await fetchDimensionData(shortcode, type);
                    return { type, result };
                });
                const results = await Promise.all(promises);
                const newData: Record<string, DimensionStatResponse | GeographyStatResponse> = {};
                results.forEach(({ type, result }) => {
                    newData[type] = result;
                });
                setData(newData);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Failed to fetch statistics");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shortcode, dimensionsToFetch.join(',')]);

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
			setSelectedDimensions(["BROWSER"]); // Default selection
		} else {
			// If not selected All yet, select all
			setIsAllSelected(true);
			setSelectedDimensions([]); // Clear individual selections
		}
	};

	// Helper function to get dimension titles
	function getDimensionTitle(dimensionType: DimensionType): string {
		const titles: Record<DimensionType, string> = {
			BROWSER: "Browser",
			OS: "Operating System",
			DEVICE_TYPE: "Device Type",
			CITY: "City",
			COUNTRY: "Country",
			REFERRER: "Referrer",
			REFERRER_TYPE: "Referrer Type",
			UTM_SOURCE: "UTM Source",
			UTM_MEDIUM: "UTM Medium",
			UTM_CAMPAIGN: "UTM Campaign",
			UTM_TERM: "UTM Term",
			UTM_CONTENT: "UTM Content",
			REGION: "Region",
			TIMEZONE: "Timezone",
			ISP: "Internet Service Provider",
		};
		return titles[dimensionType] || dimensionType;
	}

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
						<span className="text-red-800">Error loading statistics: {error}</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-2 md:p-6 space-y-6">
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
						<span className="text-sm text-gray-500 hidden sm:inline">
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
					<div className="border-t border-gray-200 p-4 md:p-6 animate-in slide-in-from-top-2 duration-200">
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
					<div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Visual Analytics
							</h3>
							<div className="flex bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
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
						<div className="grid grid-cols-1 gap-6">
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
					<div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
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
};
