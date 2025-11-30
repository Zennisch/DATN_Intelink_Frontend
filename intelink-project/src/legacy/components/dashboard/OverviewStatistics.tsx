import { useEffect, useState, useMemo } from "react";
import { OverviewStatisticsService } from "../../services/OverviewStatisticsService";
import type { CountryStatisticsResponse, TimeSeriesResponse, DimensionStatisticsResponse, DimensionType } from "../../services/OverviewStatisticsService";
import { CountryMapChart } from "../statistic/CountryMapChart";
import { LineChart } from "../ui/LineChart";

type TabType = "country" | "timeseries" | "dimension";
type Granularity = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";

const COUNTRY_NAMES: Record<string, string> = {
	CN: "China",
	CA: "Canada",
	TH: "Thailand",
	VN: "Vietnam",
	BR: "Brazil",
	PH: "Philippines",
	AU: "Australia",
	JP: "Japan",
	MY: "Malaysia",
	US: "United States",
	UK: "United Kingdom",
	DE: "Germany",
	FR: "France",
	IN: "India",
	KR: "South Korea",
	SG: "Singapore",
	ID: "Indonesia",
	UNKNOWN: "Unknown",
};

const DIMENSION_LABELS: Record<DimensionType, string> = {
	COUNTRY: "Country",
	REFERRER: "Referrer",
	REFERRER_TYPE: "Referrer Type",
	UTM_SOURCE: "UTM Source",
	UTM_MEDIUM: "UTM Medium",
	UTM_CAMPAIGN: "UTM Campaign",
	BROWSER: "Browser",
	OS: "Operating System",
	DEVICE_TYPE: "Device Type",
	CITY: "City",
	REGION: "Region",
	TIMEZONE: "Timezone",
	ISP: "ISP",
	LANGUAGE: "Language",
};

export const OverviewStatistics = () => {
	const [activeTab, setActiveTab] = useState<TabType>("country");
	const [countryData, setCountryData] = useState<CountryStatisticsResponse | null>(null);
	const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResponse | null>(null);
	const [dimensionData, setDimensionData] = useState<Map<DimensionType, DimensionStatisticsResponse>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Date range state
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [granularity, setGranularity] = useState<Granularity>("DAILY");
	const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>(["COUNTRY"]);
	const [dimensionLimit, setDimensionLimit] = useState<number>(20);

	// Initialize with last 30 days
	useEffect(() => {
		const end = new Date();
		const start = new Date();
		start.setDate(end.getDate() - 30);
		setStartDate(start.toISOString().split("T")[0]);
		setEndDate(end.toISOString().split("T")[0]);
	}, []);

	// Auto-fetch when dates change
	useEffect(() => {
		const fetchCountryStats = async () => {
			if (!startDate || !endDate) return;

			setLoading(true);
			setError(null);
			try {
				const from = `${startDate}T00:00:00Z`;
				const to = `${endDate}T23:59:59Z`;
				const data = await OverviewStatisticsService.getCountryStatistics(from, to, 10);
				setCountryData(data);
			} catch (err) {
				const error = err as { response?: { data?: { message?: string } } };
				setError(error.response?.data?.message || "Failed to fetch country statistics");
			} finally {
				setLoading(false);
			}
		};

		const fetchTimeSeriesStats = async () => {
			if (!startDate || !endDate) return;

			setLoading(true);
			setError(null);
			try {
				const from = `${startDate}T00:00:00Z`;
				const to = `${endDate}T23:59:59Z`;
				const data = await OverviewStatisticsService.getTimeSeriesStatistics(granularity, from, to);
				setTimeSeriesData(data);
			} catch (err) {
				const error = err as { response?: { data?: { message?: string } } };
				setError(error.response?.data?.message || "Failed to fetch time series statistics");
			} finally {
				setLoading(false);
			}
		};

		const fetchDimensionStats = async () => {
			setLoading(true);
			setError(null);
			try {
				const from = startDate ? `${startDate}T00:00:00Z` : undefined;
				const to = endDate ? `${endDate}T23:59:59Z` : undefined;
				
				// Fetch data for all selected dimensions
				const results = new Map<DimensionType, DimensionStatisticsResponse>();
				await Promise.all(
					selectedDimensions.map(async (dimension) => {
						const data = await OverviewStatisticsService.getDimensionStatistics(
							dimension,
							from,
							to,
							dimensionLimit
						);
						results.set(dimension, data);
					})
				);
				setDimensionData(results);
			} catch (err) {
				const error = err as { response?: { data?: { message?: string } } };
				setError(error.response?.data?.message || "Failed to fetch dimension statistics");
			} finally {
				setLoading(false);
			}
		};

		if (activeTab === "country" && startDate && endDate) {
			fetchCountryStats();
		} else if (activeTab === "timeseries" && startDate && endDate) {
			fetchTimeSeriesStats();
		} else if (activeTab === "dimension") {
			fetchDimensionStats();
		}
	}, [startDate, endDate, activeTab, granularity, selectedDimensions, dimensionLimit]);

	// Calculate max value for bar chart
	const maxValue = useMemo(() => {
		if (activeTab === "country" && countryData) {
			return Math.max(...countryData.data.map(d => d.views), 1);
		}
		if (activeTab === "timeseries" && timeSeriesData) {
			return Math.max(...timeSeriesData.data.map(d => d.views), 1);
		}
		return 1;
	}, [activeTab, countryData, timeSeriesData]);

	// Convert country data to map format
	const countryMapData = useMemo(() => {
		if (!countryData) return [];
		
		const total = countryData.data.reduce((sum, d) => sum + d.views, 0);
		
		return countryData.data.map(item => ({
			name: item.country,
			clicks: item.views,
			percentage: total > 0 ? (item.views / total) * 100 : 0
		}));
	}, [countryData]);

	// Convert time series data to line chart format with fake allows and blocks
	const lineChartData = useMemo(() => {
		if (!timeSeriesData) return [];
		
		return timeSeriesData.data.map(item => {
			const clicks = item.views;
			// Generate fake allows: 70-90% of clicks
			const allowsPercentage = 0.7 + Math.random() * 0.2;
			const allows = Math.floor(clicks * allowsPercentage);
			// Generate fake blocks: remaining + some random variance
			const blocks = Math.max(0, clicks - allows + Math.floor(Math.random() * clicks * 0.1));
			
			return {
				time: item.date,
				clicks,
				allows,
				blocks,
			};
		});
	}, [timeSeriesData]);

	const applyPreset = (days: number | null) => {
		const end = new Date();
		const start = new Date();
		
		if (days === null) {
			// All time: set to a very early date (e.g., 10 years ago)
			start.setFullYear(end.getFullYear() - 10);
		} else {
			start.setDate(end.getDate() - days);
		}
		
		setStartDate(start.toISOString().split("T")[0]);
		setEndDate(end.toISOString().split("T")[0]);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
			{/* Tabs */}
			<div className="flex gap-1 md:gap-2 mb-4 md:mb-6 border-b border-gray-200 overflow-x-auto">
				<button
					onClick={() => setActiveTab("country")}
					className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
						activeTab === "country"
							? "text-blue-600 border-blue-600"
							: "text-gray-600 border-transparent hover:text-gray-900"
					}`}
				>
					By Country
				</button>
				<button
					onClick={() => setActiveTab("timeseries")}
					className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
						activeTab === "timeseries"
							? "text-blue-600 border-blue-600"
							: "text-gray-600 border-transparent hover:text-gray-900"
					}`}
				>
					Time Series
				</button>
				<button
					onClick={() => setActiveTab("dimension")}
					className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
						activeTab === "dimension"
							? "text-blue-600 border-blue-600"
							: "text-gray-600 border-transparent hover:text-gray-900"
					}`}
				>
					By Dimension
				</button>
			</div>

			{/* Date Range Controls */}
			<div className="mb-4 md:mb-6">
				<div className="flex flex-wrap gap-2 md:gap-3 items-end">
					<div className="flex-1 min-w-[200px]">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Start Date
						</label>
						<input
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex-1 min-w-[200px]">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							End Date
						</label>
						<input
							type="date"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					{/* Granularity selector for time series */}
					{activeTab === "timeseries" && (
						<div className="flex-1 min-w-[150px]">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Granularity
							</label>
							<select
								value={granularity}
								onChange={(e) => setGranularity(e.target.value as Granularity)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="HOURLY">Hourly</option>
								<option value="DAILY">Daily</option>
								<option value="MONTHLY">Monthly</option>
								<option value="YEARLY">Yearly</option>
							</select>
						</div>
					)}

					{/* Dimension and Limit selectors for dimension tab */}
					{activeTab === "dimension" && (
						<>
							<div className="flex-1 min-w-[200px]">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Limit
								</label>
								<select
									value={dimensionLimit}
									onChange={(e) => setDimensionLimit(Number(e.target.value))}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									<option value={10}>Top 10</option>
									<option value={20}>Top 20</option>
									<option value={50}>Top 50</option>
									<option value={100}>Top 100</option>
								</select>
							</div>
						</>
					)}
				</div>

				{/* Dimension selector - full width for dimension tab */}
				{activeTab === "dimension" && (
					<div className="mt-4 border-t border-gray-200 pt-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Dimensions
						</label>
						<div className="flex items-center gap-2 mb-3">
							<button
								onClick={() => setSelectedDimensions(Object.keys(DIMENSION_LABELS) as DimensionType[])}
								className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
							>
								Select All
							</button>
							<button
								onClick={() => setSelectedDimensions([])}
								className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
							>
								Clear All
							</button>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
							{Object.entries(DIMENSION_LABELS).map(([key, label]) => {
								const dimensionKey = key as DimensionType;
								const isSelected = selectedDimensions.includes(dimensionKey);
								return (
									<label
										key={key}
										className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
											isSelected
												? "bg-blue-50 border-blue-300 text-blue-700"
												: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
										}`}
									>
										<input
											type="checkbox"
											checked={isSelected}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedDimensions([...selectedDimensions, dimensionKey]);
												} else {
													setSelectedDimensions(selectedDimensions.filter(d => d !== dimensionKey));
												}
											}}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<span className="text-sm font-medium">{label}</span>
									</label>
								);
							})}
						</div>
					</div>
				)}

				{/* Quick presets - hide for dimension tab */}
				{activeTab !== "dimension" && (
					<div className="flex gap-2 mt-3">
						<button
							onClick={() => applyPreset(7)}
							className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							Last 7 days
						</button>
						<button
							onClick={() => applyPreset(30)}
							className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							Last 30 days
						</button>
						<button
							onClick={() => applyPreset(90)}
							className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							Last 90 days
						</button>
						<button
							onClick={() => applyPreset(null)}
							className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						>
							All Time
						</button>
					</div>
				)}
			</div>

			{/* Loading/Error States */}
			{loading && (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			)}

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
					<p className="text-red-700 text-sm">{error}</p>
				</div>
			)}

			{/* Country Statistics */}
			{!loading && !error && activeTab === "country" && countryData && (
				<div className="space-y-6">
					{/* Summary */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-blue-50 rounded-lg p-4">
							<div className="text-sm text-blue-600 font-medium">Total Countries</div>
							<div className="text-2xl font-bold text-blue-900">{countryData.data.length}</div>
						</div>
						<div className="bg-green-50 rounded-lg p-4">
							<div className="text-sm text-green-600 font-medium">Total Views</div>
							<div className="text-2xl font-bold text-green-900">
								{countryData.data.reduce((sum, d) => sum + d.views, 0).toLocaleString()}
							</div>
						</div>
					</div>

					{/* Map Visualization & Bar Chart Side by Side */}
					<div className="grid grid-cols-1 lg:grid-cols-10 gap-4 h-auto lg:h-[600px]">
						{/* Map - 7 columns on large screens, full width on mobile */}
						<div className="lg:col-span-7 h-[400px] lg:h-full">
							<CountryMapChart 
								data={countryMapData} 
								title="Geographic Distribution of Views"
							/>
						</div>

						{/* Bar Chart - 3 columns on large screens, full width on mobile */}
						<div className="lg:col-span-3 h-[500px] lg:h-full">
							<div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
								<h3 className="text-base font-semibold text-gray-900 mb-3 text-center">Top Countries</h3>
								<div className="space-y-2 overflow-y-auto flex-1">
									{countryData.data.slice(0, 10).map((item, index) => {
										const percentage = (item.views / maxValue) * 100;
										return (
											<div key={item.country} className="space-y-1">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<span className="text-xs text-gray-600 font-medium w-6">
															#{index + 1}
														</span>
														<span className="text-xs font-medium text-gray-900 truncate">
															{COUNTRY_NAMES[item.country] || item.country}
														</span>
													</div>
													<span className="text-xs text-gray-600 whitespace-nowrap ml-2">
														{item.views.toLocaleString()}
													</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden ml-8">
													<div
														className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
														style={{ width: `${percentage}%` }}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>

					{/* Table */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Data</h3>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 border-y border-gray-200">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
											Rank
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
											Country
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
											Code
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
											Views
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
											Percentage
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{countryData.data.map((item, index) => {
										const total = countryData.data.reduce((sum, d) => sum + d.views, 0);
										const percentage = ((item.views / total) * 100).toFixed(2);
										return (
											<tr key={item.country} className="hover:bg-gray-50">
												<td className="px-4 py-3 text-sm text-gray-900">#{index + 1}</td>
												<td className="px-4 py-3 text-sm font-medium text-gray-900">
													{COUNTRY_NAMES[item.country] || item.country}
												</td>
												<td className="px-4 py-3 text-sm text-gray-600">{item.country}</td>
												<td className="px-4 py-3 text-sm text-gray-900 text-right">
													{item.views.toLocaleString()}
												</td>
												<td className="px-4 py-3 text-sm text-gray-600 text-right">
													{percentage}%
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{/* Time Series Statistics */}
			{!loading && !error && activeTab === "timeseries" && timeSeriesData && (
				<div className="space-y-6">
					{/* Summary */}
					<div className="grid grid-cols-3 gap-4">
						<div className="bg-purple-50 rounded-lg p-4">
							<div className="text-sm text-purple-600 font-medium">Total Clicks</div>
							<div className="text-2xl font-bold text-purple-900">
								{lineChartData.reduce((sum, d) => sum + d.clicks, 0).toLocaleString()}
							</div>
						</div>
						<div className="bg-green-50 rounded-lg p-4">
							<div className="text-sm text-green-600 font-medium">Total Allows</div>
							<div className="text-2xl font-bold text-green-900">
								{lineChartData.reduce((sum, d) => sum + d.allows, 0).toLocaleString()}
							</div>
						</div>
						<div className="bg-red-50 rounded-lg p-4">
							<div className="text-sm text-red-600 font-medium">Total Blocks</div>
							<div className="text-2xl font-bold text-red-900">
								{lineChartData.reduce((sum, d) => sum + d.blocks, 0).toLocaleString()}
							</div>
						</div>
					</div>

					{/* Line Chart */}
					<div>
						<LineChart 
							data={lineChartData} 
							title={`Views over Time (${timeSeriesData.granularity})`}
						/>
					</div>

					{/* Table */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Data</h3>
						<div className="overflow-x-auto max-h-[400px]">
							<table className="w-full">
								<thead className="bg-gray-50 border-y border-gray-200 sticky top-0">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
											Date/Time
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
											Views
										</th>
										<th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
											% of Total
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{timeSeriesData.data.map((item, index) => {
										const percentage = ((item.views / timeSeriesData.totalViews) * 100).toFixed(2);
										return (
											<tr key={`${item.date}-${index}`} className="hover:bg-gray-50">
												<td className="px-4 py-3 text-sm font-mono text-gray-900">
													{item.date}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900 text-right">
													{item.views.toLocaleString()}
												</td>
												<td className="px-4 py-3 text-sm text-gray-600 text-right">
													{percentage}%
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}

			{/* Dimension Statistics */}
			{!loading && !error && activeTab === "dimension" && dimensionData.size > 0 && (
				<div className="space-y-6">
					{/* Summary */}
					<div className="grid grid-cols-3 gap-4">
						<div className="bg-purple-50 rounded-lg p-4">
							<div className="text-sm text-purple-600 font-medium">Selected Dimensions</div>
							<div className="text-2xl font-bold text-purple-900">{dimensionData.size}</div>
						</div>
						<div className="bg-blue-50 rounded-lg p-4">
							<div className="text-sm text-blue-600 font-medium">Total Items</div>
							<div className="text-2xl font-bold text-blue-900">
								{Array.from(dimensionData.values()).reduce((sum, data) => sum + data.stats.length, 0)}
							</div>
						</div>
						<div className="bg-green-50 rounded-lg p-4">
							<div className="text-sm text-green-600 font-medium">Total Clicks</div>
							<div className="text-2xl font-bold text-green-900">
								{Array.from(dimensionData.values())
									.reduce((sum, data) => sum + data.stats.reduce((s, d) => s + d.clicks, 0), 0)
									.toLocaleString()}
							</div>
						</div>
					</div>

					{/* Bar Charts in grid: 1 column for single dimension, 2 columns for multiple */}
					<div className={`grid gap-4 md:gap-6 ${dimensionData.size === 1 ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
						{Array.from(dimensionData.entries()).map(([dimension, data]) => (
							<div key={dimension} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
								{/* Dimension Header */}
								<div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
									<h3 className="text-lg font-semibold text-white">
										{DIMENSION_LABELS[dimension]}
									</h3>
									<p className="text-sm text-blue-100 mt-1">
										Top {data.stats.length} items • {data.stats.reduce((sum, s) => sum + s.clicks, 0).toLocaleString()} total clicks
									</p>
								</div>

								{/* Bar Chart */}
								<div className="p-6">
									<div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
										{data.stats.map((item, index) => {
											const maxClicks = Math.max(...data.stats.map(s => s.clicks), 1);
											const percentage = (item.clicks / maxClicks) * 100;
											const totalClicks = data.stats.reduce((sum, s) => sum + s.clicks, 0);
											const sharePercentage = ((item.clicks / totalClicks) * 100).toFixed(1);
											
											return (
												<div key={`${dimension}-${item.value}-${index}`} className="space-y-1.5">
													{/* Header row with rank, name, percentage and clicks */}
													<div className="flex items-center justify-between gap-3">
														<div className="flex items-center gap-2 flex-1 min-w-0">
															<span className="text-xs text-gray-500 font-semibold w-7 flex-shrink-0">
																#{index + 1}
															</span>
															<span 
																className="text-sm font-medium text-gray-900 truncate flex-1" 
																title={item.value}
															>
																{item.value || "(Unknown)"}
															</span>
														</div>
														<div className="flex items-center gap-3 flex-shrink-0">
															<span className="text-xs text-gray-500 font-medium min-w-[45px] text-right">
																{sharePercentage}%
															</span>
															<span className="text-sm font-bold text-gray-900 min-w-[70px] text-right">
																{item.clicks.toLocaleString()}
															</span>
														</div>
													</div>
													{/* Progress bar */}
													<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
														<div
															className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
															style={{ width: `${Math.max(percentage, 2)}%` }}
														/>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Detailed Tables Section - Full Width Below */}
					<div className="space-y-6">
						<div className="border-t border-gray-300 pt-6">
							<h2 className="text-xl font-bold text-gray-900 mb-6">Detailed Data Tables</h2>
						</div>
						
						{Array.from(dimensionData.entries()).map(([dimension, data]) => (
							<div key={`table-${dimension}`} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
								{/* Table Header */}
								<div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
									<h3 className="text-lg font-semibold text-gray-900">
										{DIMENSION_LABELS[dimension]}
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										{data.stats.length} items • {data.stats.reduce((sum, s) => sum + s.clicks, 0).toLocaleString()} total clicks
									</p>
								</div>

								{/* Table */}
								<div className="overflow-x-auto">
									<div className="max-h-[500px] overflow-y-auto">
										<table className="w-full">
											<thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
												<tr>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20">
														Rank
													</th>
													<th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
														Value
													</th>
													<th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-32">
														Clicks
													</th>
													<th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider w-24">
														Percentage
													</th>
												</tr>
											</thead>
											<tbody className="bg-white divide-y divide-gray-200">
												{data.stats.map((item, index) => {
													const total = data.stats.reduce((sum, s) => sum + s.clicks, 0);
													const percentage = ((item.clicks / total) * 100).toFixed(2);
													return (
														<tr key={`${dimension}-table-${item.value}-${index}`} className="hover:bg-gray-50 transition-colors">
															<td className="px-6 py-3 text-sm text-gray-900 font-medium">
																#{index + 1}
															</td>
															<td className="px-6 py-3 text-sm font-medium text-gray-900" title={item.value}>
																<div className="max-w-md truncate">
																	{item.value || "(Unknown)"}
																</div>
															</td>
															<td className="px-6 py-3 text-sm text-gray-900 text-right font-semibold whitespace-nowrap">
																{item.clicks.toLocaleString()}
															</td>
															<td className="px-6 py-3 text-sm text-gray-600 text-right whitespace-nowrap">
																{percentage}%
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Empty state */}
			{!loading && !error && activeTab === "country" && !countryData && (
				<div className="text-center py-12 text-gray-500">
					No country statistics available. Please select a date range.
				</div>
			)}
			{!loading && !error && activeTab === "timeseries" && !timeSeriesData && (
				<div className="text-center py-12 text-gray-500">
					No time series data available. Please select a date range.
				</div>
			)}
			{!loading && !error && activeTab === "dimension" && dimensionData.size === 0 && (
				<div className="text-center py-12">
					<div className="text-gray-400 mb-3">
						<svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<p className="text-gray-500 font-medium">No dimensions selected</p>
					<p className="text-gray-400 text-sm mt-1">Please select at least one dimension to view statistics</p>
				</div>
			)}
		</div>
	);
};
