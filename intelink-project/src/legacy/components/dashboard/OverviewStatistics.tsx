import { useEffect, useState, useMemo } from "react";
import { OverviewStatisticsService } from "../../services/OverviewStatisticsService";
import type { CountryStatisticsResponse, TimeSeriesResponse } from "../../services/OverviewStatisticsService";

type TabType = "country" | "timeseries";
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

export const OverviewStatistics = () => {
	const [activeTab, setActiveTab] = useState<TabType>("country");
	const [countryData, setCountryData] = useState<CountryStatisticsResponse | null>(null);
	const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Date range state
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [granularity, setGranularity] = useState<Granularity>("DAILY");

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

		if (startDate && endDate) {
			if (activeTab === "country") {
				fetchCountryStats();
			} else {
				fetchTimeSeriesStats();
			}
		}
	}, [startDate, endDate, activeTab, granularity]);

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

	const applyPreset = (days: number) => {
		const end = new Date();
		const start = new Date();
		start.setDate(end.getDate() - days);
		setStartDate(start.toISOString().split("T")[0]);
		setEndDate(end.toISOString().split("T")[0]);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{/* Tabs */}
			<div className="flex gap-2 mb-6 border-b border-gray-200">
				<button
					onClick={() => setActiveTab("country")}
					className={`px-4 py-2 font-medium transition-colors border-b-2 ${
						activeTab === "country"
							? "text-blue-600 border-blue-600"
							: "text-gray-600 border-transparent hover:text-gray-900"
					}`}
				>
					By Country
				</button>
				<button
					onClick={() => setActiveTab("timeseries")}
					className={`px-4 py-2 font-medium transition-colors border-b-2 ${
						activeTab === "timeseries"
							? "text-blue-600 border-blue-600"
							: "text-gray-600 border-transparent hover:text-gray-900"
					}`}
				>
					Time Series
				</button>
			</div>

			{/* Date Range Controls */}
			<div className="mb-6">
				<div className="flex flex-wrap gap-3 items-end">
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
				</div>

				{/* Quick presets */}
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
				</div>
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

					{/* Bar Chart */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Views by Country</h3>
						<div className="space-y-3">
							{countryData.data.map((item, index) => {
								const percentage = (item.views / maxValue) * 100;
								return (
									<div key={item.country} className="flex items-center gap-3">
										<div className="w-12 text-sm text-gray-600 font-medium">
											#{index + 1}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-1">
												<span className="text-sm font-medium text-gray-900">
													{COUNTRY_NAMES[item.country] || item.country}
												</span>
												<span className="text-sm text-gray-600">
													{item.views.toLocaleString()} views
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												<div
													className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									</div>
								);
							})}
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
							<div className="text-sm text-purple-600 font-medium">Total Views</div>
							<div className="text-2xl font-bold text-purple-900">
								{timeSeriesData.totalViews.toLocaleString()}
							</div>
						</div>
						<div className="bg-indigo-50 rounded-lg p-4">
							<div className="text-sm text-indigo-600 font-medium">Data Points</div>
							<div className="text-2xl font-bold text-indigo-900">
								{timeSeriesData.data.length}
							</div>
						</div>
						<div className="bg-pink-50 rounded-lg p-4">
							<div className="text-sm text-pink-600 font-medium">Average/Period</div>
							<div className="text-2xl font-bold text-pink-900">
								{timeSeriesData.data.length > 0
									? Math.round(timeSeriesData.totalViews / timeSeriesData.data.length)
									: 0}
							</div>
						</div>
					</div>

					{/* Bar Chart */}
					<div>
						<h3 className="text-lg font-semibold text-gray-900 mb-4">
							Views over Time ({timeSeriesData.granularity})
						</h3>
						<div className="space-y-2 max-h-[500px] overflow-y-auto">
							{timeSeriesData.data.map((item, index) => {
								const percentage = (item.views / maxValue) * 100;
								return (
									<div key={`${item.date}-${index}`} className="flex items-center gap-3">
										<div className="w-24 text-sm text-gray-600 font-mono">
											{item.date}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-1">
												<span className="text-sm text-gray-600">
													{item.views} views
												</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
												<div
													className="bg-gradient-to-r from-purple-500 to-pink-600 h-3 rounded-full transition-all duration-300"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>
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
		</div>
	);
};
