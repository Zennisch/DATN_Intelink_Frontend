"use client";

import axios from "axios";
import type React from "react";
import { useState, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type DimensionType = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";

export interface StatisticsData {
	name: string;
	clicks: number;
	percentage: number;
}

export interface StatisticsResponse {
	granularity: DimensionType;
	from: string;
	to: string;
	totalClicks: number;
	buckets: { time: string; clicks: number }[];
}

interface TimeStatisticsProps {
	shortcode: string;
	validShortcodes?: string[]; // Optional prop for valid shortcodes
}

export const TimeStatistics: React.FC<TimeStatisticsProps> = ({ shortcode, validShortcodes = [] }) => {
	const [granularity, setGranularity] = useState<DimensionType>("HOURLY");
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [data, setData] = useState<StatisticsData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const formatDate = (date: Date | undefined): string | undefined => {
		if (!date) return undefined;
		// Đặt giờ về 00:00:00 UTC
		const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
		return d.toISOString();
	};

	// Validate date range and shortcode
	const validateInputs = (_start: Date | undefined, _end: Date | undefined, _granularity: DimensionType, shortcode: string): string | null => {
		if (!shortcode || shortcode.trim() === "") {
			return "Invalid or missing shortcode.";
		}
		if (validShortcodes.length > 0 && !validShortcodes.includes(shortcode)) {
			return `The shortcode "${shortcode}" is not valid. Please select a valid shortcode from the URL list.`;
		}

		// if (start && end) {
		// 	const diffTime = Math.abs(end.getTime() - start.getTime());
		// 	const diffDays = diffTime / (1000 * 60 * 60 * 24);

		// 	if (granularity === "HOURLY" && diffDays > 7) {
		// 		return "Hourly granularity is limited to a 7-day range.";
		// 	}
		// 	if (granularity === "DAILY" && diffDays > 90) {
		// 		return "Daily granularity is limited to a 90-day range.";
		// 	}
		// 	if (granularity === "MONTHLY" && diffDays > 730) {
		// 		return "Monthly granularity is limited to a 2-year range.";
		// 	}

		// 	const today = new Date();
		// 	if (start > today || end > today) {
		// 		return "Date range cannot include future dates.";
		// 	}

		// 	if (start > end) {
		// 		return "Start date must be before end date.";
		// 	}
		// }

		return null;
	};

	const fetchTimeStats = async () => {
		setLoading(true);
		setError(null);

		const validationError = validateInputs(startDate, endDate, granularity, shortcode);
		if (validationError) {
			setError(validationError);
			setLoading(false);
			return;
		}

		try {
			const params = new URLSearchParams();
			if (startDate) params.append("customFrom", formatDate(startDate)!);
			if (endDate) params.append("customTo", formatDate(endDate)!);
			params.append("granularity", granularity);

			const url = `/statistics/${shortcode}/time?${params.toString()}`;
			console.log("Fetching URL:", url);

			const response = await axios.get(url);
			console.log("Response:", { status: response.status, headers: response.headers, data: response.data });

			if (response.status !== 200) {
				if (response.status === 404) {
					setData([]);
					setError(null);
					setLoading(false);
					return;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.headers["content-type"]?.includes("application/json")) {
				throw new Error(`Expected JSON, received ${response.headers["content-type"]}`);
			}

			const result: StatisticsResponse = response.data;
			if (!result.buckets || !Array.isArray(result.buckets)) {
				throw new Error("Invalid response: 'buckets' field is missing or not an array");
			}

			const totalClicks = result.totalClicks || result.buckets.reduce((sum, b) => sum + b.clicks, 0);
			const transformedData: StatisticsData[] = result.buckets.map((bucket) => ({
				name: new Date(bucket.time).toLocaleString("en-US", {
					month: granularity === "MONTHLY" ? "short" : undefined,
					year: granularity === "MONTHLY" || granularity === "YEARLY" ? "numeric" : undefined,
					day: granularity === "DAILY" ? "numeric" : undefined,
					hour: granularity === "HOURLY" ? "numeric" : undefined,
					timeZone: "UTC",
				}) || bucket.time,
				clicks: bucket.clicks,
				percentage: totalClicks ? (bucket.clicks / totalClicks) * 100 : 0,
			}));

			setData(transformedData);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
			setError(errorMessage);
			setData([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTimeStats();
	}, [shortcode, granularity, startDate, endDate]);

	const chartData = {
		labels: data.map((item) => item.name),
		datasets: [
			{
				label: "Clicks",
				data: data.map((item) => item.clicks),
				backgroundColor: "#3B82F6",
				borderColor: "#2563EB",
				borderWidth: 1,
				barPercentage: 1.0,         // Thêm dòng này
				categoryPercentage: 1.0,    // Thêm dòng này
				borderSkipped: false,       // Thêm dòng này để cột liền nhau
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: "top" as const },
			title: {
				display: true,
				text: `Click Statistics (${granularity})`,
				font: { size: 16 },
			},
			tooltip: {
				callbacks: {
					label: (context: TooltipItem<"bar">) => {
						const item = data[context.dataIndex];
						return `${context.label}: ${item.clicks} (${item.percentage.toFixed(1)}%)`;
					},
				},
			},
		},
		scales: {
			x: {
				title: { display: true, text: granularity.charAt(0).toUpperCase() + granularity.slice(1).toLowerCase() },
				grid: { display: false }, // Ẩn lưới dọc nếu muốn
			},
			y: {
				beginAtZero: true,
				title: { display: true, text: "Number of Clicks" },
				grid: { display: true },
			},
		},
	};

	if (loading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
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
						<svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						<span className="text-red-800">Error loading time statistics: {error}</span>
						{error && (
							<div className="mt-2 text-sm text-gray-700">
								<div>
									<strong>Shortcode:</strong> {shortcode}
								</div>
								<div>
									<strong>Start Date:</strong> {formatDate(startDate)}
								</div>
								<div>
									<strong>End Date:</strong> {formatDate(endDate)}
								</div>
								<div>
									<strong>Granularity:</strong> {granularity}
								</div>
							</div>
						)}
					</div>
					<div className="mt-2 text-sm text-gray-700">
						{error.includes("shortcode") || error.includes("date range") || error.includes("Invalid response")
							? error
							: "Please try a different date range, granularity, or shortcode."}
						<br />
						If the problem persists, contact the system administrator.
					</div>
					<button
						onClick={fetchTimeStats}
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
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Time-based Analytics</h3>
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
						<DatePicker
							selected={startDate}
							onChange={(date: Date | null) => setStartDate(date || undefined)}
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
						<label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
						<DatePicker
							selected={endDate}
							onChange={(date: Date | null) => setEndDate(date || undefined)}
							selectsEnd
							startDate={startDate}
							endDate={endDate}
							minDate={startDate}
							maxDate={new Date()}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
							placeholderText="Select end date"
							dateFormat="yyyy-MM-dd"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">Granularity</label>
						<select
							value={granularity}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGranularity(e.target.value as DimensionType)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md"
						>
							<option value="HOURLY">Hourly</option>
							<option value="DAILY">Daily</option>
							<option value="MONTHLY">Monthly</option>
							<option value="YEARLY">Yearly</option>
						</select>
					</div>
				</div>
				{data.length > 0 ? (
					<div style={{ height: "400px" }}>
						<Bar data={chartData} options={chartOptions} />
					</div>
				) : (
					<div className="text-center py-8 text-gray-500">No time-based data available for the selected period</div>
				)}
			</div>
		</div>
	);
};