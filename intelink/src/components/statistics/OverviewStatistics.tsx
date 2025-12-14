import { useEffect, useMemo, useState } from "react";
import { useStatistics } from "../../hooks/useStatistics";
import type { DimensionType, Granularity } from "../../services/StatisticsService";
import type { GeographyStatResponse, TimeSeriesStatResponse, DimensionStatResponse } from "../../dto/StatisticsDTO";
import { CountryMapChart } from "./CountryMapChart";
import { LineChart } from "./LineChart";
import { Select } from "../primary";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type TabType = "country" | "timeseries" | "dimension";

const DIMENSION_LABELS: Partial<Record<DimensionType, string>> = {
	COUNTRY: "Country",
	BROWSER: "Browser",
	OS: "Operating System",
	DEVICE_TYPE: "Device Type",
	CITY: "City",
};

const AVAILABLE_DIMENSIONS: DimensionType[] = ["BROWSER", "OS", "DEVICE_TYPE", "COUNTRY", "CITY"];

export const OverviewStatistics = () => {
	const {
		getAllBrowserStats,
		getAllOsStats,
		getAllDeviceStats,
		getAllCountryStats,
		getAllCityStats,
		getAllTimeSeriesStats,
	} = useStatistics();

	const [activeTab, setActiveTab] = useState<TabType>("country");
	const [countryData, setCountryData] = useState<GeographyStatResponse | null>(null);
	const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesStatResponse | null>(null);
	const [dimensionData, setDimensionData] = useState<Map<DimensionType, DimensionStatResponse>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Date range state
	const [startDate, setStartDate] = useState<Date>(() => {
		const d = new Date();
		d.setDate(d.getDate() - 30);
		return d;
	});
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [granularity, setGranularity] = useState<Granularity>("DAILY");
	const [selectedDimension, setSelectedDimension] = useState<DimensionType>("BROWSER");

	// Auto-fetch when dates change
	useEffect(() => {
		const fetchCountryStats = async () => {
			if (!startDate || !endDate) return;

			setLoading(true);
			setError(null);
			try {
				const response = await getAllCountryStats({
					from: startDate.toISOString().split("T")[0],
					to: endDate.toISOString().split("T")[0],
				});
				setCountryData(response);
			} catch (err) {
				console.error("Failed to fetch country stats:", err);
				setError("Failed to load country statistics");
			} finally {
				setLoading(false);
			}
		};

		const fetchTimeSeriesStats = async () => {
			if (!startDate || !endDate) return;

			setLoading(true);
			setError(null);
			try {
				const response = await getAllTimeSeriesStats({
					granularity,
					from: startDate.toISOString().split("T")[0],
					to: endDate.toISOString().split("T")[0],
				});
				setTimeSeriesData(response);
			} catch (err) {
				console.error("Failed to fetch time series stats:", err);
				setError("Failed to load time series statistics");
			} finally {
				setLoading(false);
			}
		};

		const fetchDimensionStats = async () => {
			if (!startDate || !endDate) return;

			setLoading(true);
			setError(null);
			try {
				let response: DimensionStatResponse | GeographyStatResponse;
				switch (selectedDimension) {
					case "BROWSER":
						response = await getAllBrowserStats({
							from: startDate.toISOString().split("T")[0],
							to: endDate.toISOString().split("T")[0],
						});
						break;
					case "OS":
						response = await getAllOsStats({
							from: startDate.toISOString().split("T")[0],
							to: endDate.toISOString().split("T")[0],
						});
						break;
					case "DEVICE_TYPE":
						response = await getAllDeviceStats({
							from: startDate.toISOString().split("T")[0],
							to: endDate.toISOString().split("T")[0],
						});
						break;
					case "COUNTRY":
						response = await getAllCountryStats({
							from: startDate.toISOString().split("T")[0],
							to: endDate.toISOString().split("T")[0],
						});
						break;
					case "CITY":
						response = await getAllCityStats({
							from: startDate.toISOString().split("T")[0],
							to: endDate.toISOString().split("T")[0],
						});
						break;
					default:
						return;
				}
				
				// Normalize GeographyStatResponse to DimensionStatResponse structure if needed
				// Actually GeographyStatResponse has 'data' with 'name', 'clicks', 'percentage' which matches DimensionStatResponse
				// But TypeScript might complain if types are strictly different.
				// Let's cast or ensure compatibility.
				// Both have data: { name, clicks, percentage }[]
				
				setDimensionData(prev => new Map(prev).set(selectedDimension, response as DimensionStatResponse));
			} catch (err) {
				console.error(`Failed to fetch ${selectedDimension} stats:`, err);
				setError(`Failed to load ${selectedDimension} statistics`);
			} finally {
				setLoading(false);
			}
		};

		if (activeTab === "country") {
			fetchCountryStats();
		} else if (activeTab === "timeseries") {
			fetchTimeSeriesStats();
		} else if (activeTab === "dimension") {
			fetchDimensionStats();
		}
	}, [startDate, endDate, activeTab, granularity, selectedDimension, getAllBrowserStats, getAllOsStats, getAllDeviceStats, getAllCountryStats, getAllCityStats, getAllTimeSeriesStats]);

	// Convert country data to map format
	const countryMapData = useMemo(() => {
		if (!countryData) return [];
		
		return countryData.data.map(item => ({
			name: item.name,
			clicks: item.clicks,
		}));
	}, [countryData]);

	// Convert time series data to line chart format
	const lineChartData = useMemo(() => {
		if (!timeSeriesData) return [];
		
		return timeSeriesData.data.map(item => ({
			time: item.bucketStart,
			clicks: item.clicks,
			allows: item.allowedClicks,
			blocks: item.blockedClicks,
		}));
	}, [timeSeriesData]);

	const applyPreset = (days: number | null) => {
		const end = new Date();
		const start = new Date();
		
		if (days === null) {
			// All time - handled by backend if dates are omitted, but here we set a long range or handle null
			// For now let's just set a very old date
			start.setFullYear(2000);
		} else {
			start.setDate(end.getDate() - days);
		}
		
		setStartDate(start);
		setEndDate(end);
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
			{/* Controls Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
				<div className="flex bg-gray-100 p-1 rounded-lg">
					{(["country", "timeseries", "dimension"] as TabType[]).map((tab) => (
						<button
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === tab
									? "bg-white text-indigo-600 shadow-sm"
									: "text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.charAt(0).toUpperCase() + tab.slice(1)}
						</button>
					))}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-2 bg-gray-50 p-1 rounded-md border border-gray-200">
						<button
							onClick={() => applyPreset(7)}
							className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
						>
							7D
						</button>
						<button
							onClick={() => applyPreset(30)}
							className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
						>
							30D
						</button>
						<button
							onClick={() => applyPreset(90)}
							className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded transition-all"
						>
							3M
						</button>
					</div>

					<div className="flex items-center gap-2">
						<DatePicker
							selected={startDate}
							onChange={(date) => date && setStartDate(date)}
							selectsStart
							startDate={startDate}
							endDate={endDate}
							className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
						/>
						<span className="text-gray-400">-</span>
						<DatePicker
							selected={endDate}
							onChange={(date) => date && setEndDate(date)}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							minDate={startDate}
							className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
				</div>
			</div>

			{/* Additional Controls based on Tab */}
			{activeTab === "timeseries" && (
				<div className="mb-6 flex justify-end">
					<div className="w-40">
						<Select
							value={granularity}
							onChange={(value) => setGranularity(value as Granularity)}
							options={[
								{ value: "HOURLY", label: "Hourly" },
								{ value: "DAILY", label: "Daily" },
								{ value: "WEEKLY", label: "Weekly" },
								{ value: "MONTHLY", label: "Monthly" },
							]}
						/>
					</div>
				</div>
			)}

			{activeTab === "dimension" && (
				<div className="mb-6 flex justify-end">
					<div className="w-60">
						<Select
							value={selectedDimension}
							onChange={(value) => setSelectedDimension(value as DimensionType)}
							options={AVAILABLE_DIMENSIONS.map(dim => ({
								value: dim,
								label: DIMENSION_LABELS[dim] || dim
							}))}
						/>
					</div>
				</div>
			)}

			{/* Content */}
			{loading && (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
				</div>
			)}

			{error && (
				<div className="flex justify-center items-center h-64 text-red-500">
					{error}
				</div>
			)}

			{!loading && !error && activeTab === "country" && (
				<div className="h-[500px]">
					<CountryMapChart data={countryMapData} title="Clicks by Country" />
				</div>
			)}

			{!loading && !error && activeTab === "timeseries" && (
				<LineChart data={lineChartData} title="Clicks Over Time" />
			)}

			{!loading && !error && activeTab === "dimension" && (
				<div className="bg-white rounded-lg overflow-hidden">
					<h3 className="text-lg font-semibold mb-4 text-center">
						{DIMENSION_LABELS[selectedDimension]} Statistics
					</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Clicks
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Percentage
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Distribution
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{dimensionData.get(selectedDimension)?.data.map((item, index) => (
									<tr key={index}>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{item.name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
											{item.clicks.toLocaleString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
											{item.percentage.toFixed(1)}%
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											<div className="w-full bg-gray-200 rounded-full h-2.5">
												<div
													className="bg-indigo-600 h-2.5 rounded-full"
													style={{ width: `${item.percentage}%` }}
												></div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
