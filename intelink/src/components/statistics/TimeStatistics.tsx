import React, { useState, useEffect, useCallback } from "react";
import {
	StatisticsService,
	type Granularity,
} from "../../services/StatisticsService";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { TimeSeriesStatItemResponse } from "../../dto/StatisticsDTO";

interface TimeStatisticsProps {
	shortcode: string;
}

export const TimeStatistics: React.FC<TimeStatisticsProps> = ({
	shortcode,
}) => {
	const [granularity, setGranularity] = useState<Granularity>("HOURLY");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [data, setData] = useState<TimeSeriesStatItemResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<"regular" | "peak">("regular");

	const fetchData = useCallback(async () => {
		if (!shortcode) return;
		setLoading(true);
		setError(null);
		try {
			let responseData: TimeSeriesStatItemResponse[] = [];
			if (viewMode === "regular") {
				const response = await StatisticsService.getTimeSeriesStats(shortcode, {
					granularity,
					from: startDate?.toISOString(),
					to: endDate?.toISOString(),
				});
				responseData = response.data;
			} else {
				const response = await StatisticsService.getPeakTimeStats(shortcode, {
					granularity,
					from: startDate?.toISOString(),
					to: endDate?.toISOString(),
				});
				responseData = response.data;
			}
			setData(responseData);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Failed to fetch statistics");
			}
			setData([]);
		} finally {
			setLoading(false);
		}
	}, [shortcode, granularity, startDate, endDate, viewMode]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const formatXAxis = (tickItem: string) => {
		const date = new Date(tickItem);
		if (granularity === "HOURLY")
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		if (granularity === "DAILY") return date.toLocaleDateString();
		if (granularity === "MONTHLY")
			return date.toLocaleDateString([], { month: "short", year: "numeric" });
		if (granularity === "YEARLY") return date.getFullYear().toString();
		return date.toLocaleDateString();
	};

	const formatTooltipLabel = (label: string) => {
		return new Date(label).toLocaleString();
	};

	return (
		<div className="p-2 space-y-6">
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold text-gray-900">
						Time-based Analytics
					</h3>
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setViewMode("regular")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								viewMode === "regular"
									? "bg-white text-blue-600 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Regular Stats
						</button>
						<button
							onClick={() => setViewMode("peak")}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								viewMode === "peak"
									? "bg-white text-green-600 shadow-sm"
									: "text-gray-600 hover:text-gray-900"
							}`}
						>
							Top Peak Times
						</button>
					</div>
				</div>

				{viewMode === "regular" && (
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Start Date
							</label>
							<DatePicker
								selected={startDate}
								onChange={(date) => setStartDate(date)}
								selectsStart
								startDate={startDate}
								endDate={endDate}
								maxDate={endDate || new Date()}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholderText="Select start date"
								dateFormat="yyyy-MM-dd"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								End Date
							</label>
							<DatePicker
								selected={endDate}
								onChange={(date) => setEndDate(date)}
								selectsEnd
								startDate={startDate}
								endDate={endDate}
								minDate={startDate ?? undefined}
								maxDate={new Date()}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
								placeholderText="Select end date"
								dateFormat="yyyy-MM-dd"
							/>
						</div>
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Granularity
							</label>
							<select
								value={granularity}
								onChange={(e) => setGranularity(e.target.value as Granularity)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							>
								<option value="HOURLY">Hourly</option>
								<option value="DAILY">Daily</option>
								<option value="WEEKLY">Weekly</option>
								<option value="MONTHLY">Monthly</option>
								<option value="YEARLY">Yearly</option>
							</select>
						</div>
					</div>
				)}

				{viewMode === "peak" && (
					<div className="mb-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-2 flex items-end">
								<div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
									<strong>Top Peak Times:</strong> Shows the time periods with the
									highest click counts.
								</div>
							</div>
							<div className="flex-1">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Granularity
								</label>
								<select
									value={granularity}
									onChange={(e) =>
										setGranularity(e.target.value as Granularity)
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-md"
								>
									<option value="HOURLY">Hourly</option>
									<option value="DAILY">Daily</option>
									<option value="WEEKLY">Weekly</option>
									<option value="MONTHLY">Monthly</option>
									<option value="YEARLY">Yearly</option>
								</select>
							</div>
						</div>
					</div>
				)}

				{loading ? (
					<div className="h-96 flex items-center justify-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					</div>
				) : error ? (
					<div className="p-6">
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<div className="flex items-center">
								<span className="text-red-800">Error: {error}</span>
							</div>
							<button
								onClick={fetchData}
								className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
							>
								Try Again
							</button>
						</div>
					</div>
				) : data.length > 0 ? (
					<div className="h-96">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={data}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="bucketStart" tickFormatter={formatXAxis} />
								<YAxis />
								<Tooltip labelFormatter={formatTooltipLabel} />
								<Legend />
								<Line
									type="monotone"
									dataKey="clicks"
									stroke="#3B82F6"
									name="Total Clicks"
									strokeWidth={2}
									activeDot={{ r: 8 }}
								/>
								<Line
									type="monotone"
									dataKey="allowedClicks"
									stroke="#10B981"
									name="Allowed"
									strokeWidth={2}
								/>
								<Line
									type="monotone"
									dataKey="blockedClicks"
									stroke="#EF4444"
									name="Blocked"
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">
						{viewMode === "peak"
							? "No peak times data available for the selected granularity"
							: "No time-based data available for the selected period"}
					</div>
				)}
			</div>
		</div>
	);
};
