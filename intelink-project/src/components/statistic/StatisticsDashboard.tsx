"use client";

import type React from "react";
import { useState } from "react";
import { DimensionType, DIMENSION_CATEGORIES } from "../../types/statistics.ts";
import { useStatistics } from "../../hooks/useStatistics";
import { StatisticsChart } from "./StatisticsChart.tsx";
import { DimensionSelector } from "./DimensionSelector.tsx";
import { StatisticsTable } from "./StatisticsTable.tsx";
import { CountryMapChart } from "./CountryMapChart.tsx"; // Import the new map component

interface StatisticsDashboardProps {
	shortcode: string;
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
	shortcode,
}) => {
	const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>(
		[DimensionType.BROWSER],
	);
	const [isAllSelected, setIsAllSelected] = useState(false);
	const [chartType, setChartType] = useState<"bar" | "doughnut">("bar");

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
			// Nếu đang chọn All, chuyển về chọn individual
			setIsAllSelected(false);
			setSelectedDimensions([DimensionType.BROWSER]); // Default selection
		} else {
			// If not selected All yet, select all
			setIsAllSelected(true);
			setSelectedDimensions([]); // Clear individual selections
		}
	};

	const getDimensionTitle = (dimension: DimensionType) => {
		return dimension
			.replace(/_/g, " ")
			.toLowerCase()
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading statistics...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
						<p className="font-bold">Error loading statistics</p>
						<p>{error}</p>
						<button
							onClick={refetch}
							className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Statistics Dashboard
					</h1>
					<p className="text-gray-600 mt-2">
						Shortcode: {shortcode} |
						{isAllSelected
							? ` All Dimensions (${allDimensions.length})`
							: ` ${selectedDimensions.length} Selected`}
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Dimension Selector */}
					<div className="lg:col-span-1">
						<DimensionSelector
							selectedDimensions={selectedDimensions}
							onDimensionChange={handleDimensionChange}
							isAllSelected={isAllSelected}
							onAllToggle={handleAllToggle}
						/>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3 space-y-6">
						{data && Object.keys(data).length > 0 ? (
							<>
								{/* Chart Controls */}
								<div className="bg-white p-4 rounded-lg shadow-md">
									<div className="flex items-center justify-between">
										<h2 className="text-xl font-semibold">
											{isAllSelected ? "All Dimensions" : "Selected Dimensions"}{" "}
											Statistics
										</h2>
										<div className="flex space-x-2">
											<button
												onClick={() => setChartType("bar")}
												className={`px-4 py-2 rounded-md text-sm font-medium ${
													chartType === "bar"
														? "bg-blue-500 text-white"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												Bar Chart
											</button>
											<button
												onClick={() => setChartType("doughnut")}
												className={`px-4 py-2 rounded-md text-sm font-medium ${
													chartType === "doughnut"
														? "bg-blue-500 text-white"
														: "bg-gray-200 text-gray-700 hover:bg-gray-300"
												}`}
											>
												Doughnut Chart
											</button>
										</div>
									</div>
									<p className="text-sm text-gray-600 mt-1">
										Total Charts: {Object.keys(data).length}
									</p>
								</div>

								{/* Charts Grid - 2 charts per row */}
								<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
									{Object.entries(data).map(
										([dimensionType, dimensionData]) => {
											if (
												dimensionType === DimensionType.COUNTRY &&
												dimensionData.data.length > 0
											) {
												return (
													<CountryMapChart
														key={dimensionType}
														data={dimensionData.data}
														title="Biểu đồ quốc gia truy cập"
													/>
												);
											} else if (dimensionData.data.length > 0) {
												return (
													<StatisticsChart
														key={dimensionType}
														data={dimensionData.data}
														title={getDimensionTitle(
															dimensionType as DimensionType,
														)}
														chartType={chartType}
													/>
												);
											}
											return null;
										},
									)}
								</div>

								{/* Tables */}
								<div className="space-y-6">
									<h3 className="text-xl font-semibold text-gray-900">
										Detailed Data Tables
									</h3>
									{Object.entries(data).map(
										([dimensionType, dimensionData]) => (
											<StatisticsTable
												key={`table-${dimensionType}`}
												data={dimensionData.data}
												title={getDimensionTitle(
													dimensionType as DimensionType,
												)}
											/>
										),
									)}
								</div>
							</>
						) : (
							<div className="bg-white p-8 rounded-lg shadow-md text-center">
								<p className="text-gray-500">
									No data available for the selected dimensions.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
