import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OverviewStatisticsService, type Granularity, type CountryStatisticsResponse, type TimeSeriesResponse } from "../../services/OverviewStatisticsService";
import { CountryMap } from "../../components/ui/CountryMap";
import { LineChart } from "../../components/ui/LineChart";
import { COUNTRY_NAMES } from "../../constants/constants";
import DateTimePicker from "@react-native-community/datetimepicker";

type TabType = "country" | "timeseries";

export default function OverviewScreen() {
	const [activeTab, setActiveTab] = useState<TabType>("country");
	const [countryData, setCountryData] = useState<CountryStatisticsResponse | null>(null);
	const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Date range state
	const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [granularity, setGranularity] = useState<Granularity>("DAILY");

	// Auto-fetch when dates change
	useEffect(() => {
		const fetchCountryStats = async () => {
			setLoading(true);
			setError(null);
			try {
				const from = `${startDate.toISOString().split("T")[0]}T00:00:00Z`;
				const to = `${endDate.toISOString().split("T")[0]}T23:59:59Z`;
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
			setLoading(true);
			setError(null);
			try {
				const from = `${startDate.toISOString().split("T")[0]}T00:00:00Z`;
				const to = `${endDate.toISOString().split("T")[0]}T23:59:59Z`;
				const data = await OverviewStatisticsService.getTimeSeriesStatistics(granularity, from, to);
				setTimeSeriesData(data);
			} catch (err) {
				const error = err as { response?: { data?: { message?: string } } };
				setError(error.response?.data?.message || "Failed to fetch time series statistics");
			} finally {
				setLoading(false);
			}
		};

		if (activeTab === "country") {
			fetchCountryStats();
		} else {
			fetchTimeSeriesStats();
		}
	}, [startDate, endDate, activeTab, granularity]);

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
			const allows = Math.floor(clicks * (0.7 + Math.random() * 0.2));
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
			start.setFullYear(end.getFullYear() - 10);
		} else {
			start.setDate(end.getDate() - days);
		}
		
		setStartDate(start);
		setEndDate(end);
	};

	const formatDateLabel = (date: Date) => {
		const y = date.getFullYear();
		const m = (date.getMonth() + 1).toString().padStart(2, '0');
		const d = date.getDate().toString().padStart(2, '0');
		return `${y}-${m}-${d}`;
	};

	const StatCard = ({ title, value, color }: {
		title: string;
		value: string | number;
		color: string;
	}) => (
		<View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
			<Text className="text-sm font-medium mb-1" style={{ color }}>
				{title}
			</Text>
			<Text className="text-2xl font-bold text-gray-900">
				{value}
			</Text>
		</View>
	);

	const GranularityButton = ({ g, label }: { g: Granularity; label: string }) => (
		<TouchableOpacity 
			onPress={() => setGranularity(g)} 
			className={`px-3 py-1 rounded-full ${granularity === g ? 'bg-blue-600' : 'bg-gray-100'}`}
		>
			<Text className={`${granularity === g ? 'text-white' : 'text-gray-700'} text-xs`}>
				{label}
			</Text>
		</TouchableOpacity>
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-2xl font-bold text-gray-900 mb-1">
						📊 Overview Statistics
					</Text>
					<Text className="text-gray-600">
						Global statistics across all short URLs
					</Text>
				</View>

				{/* Tabs */}
				<View className="flex-row space-x-2 mb-4">
					<TouchableOpacity
						onPress={() => setActiveTab("country")}
						className={`flex-1 px-4 py-2 rounded-lg ${
							activeTab === "country" ? 'bg-blue-600' : 'bg-gray-100'
						}`}
					>
						<Text className={`text-center font-medium ${
							activeTab === "country" ? 'text-white' : 'text-gray-700'
						}`}>
							By Country
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab("timeseries")}
						className={`flex-1 px-4 py-2 rounded-lg ${
							activeTab === "timeseries" ? 'bg-blue-600' : 'bg-gray-100'
						}`}
					>
						<Text className={`text-center font-medium ${
							activeTab === "timeseries" ? 'text-white' : 'text-gray-700'
						}`}>
							Time Series
						</Text>
					</TouchableOpacity>
				</View>

				{/* Date Range Controls */}
				<View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
					<Text className="text-base font-semibold text-gray-900 mb-3">
						Date Range
					</Text>
					
					<View className="flex-row space-x-2 mb-3">
						<TouchableOpacity 
							onPress={() => setShowStartPicker(true)} 
							className="flex-1 px-3 py-2 rounded border border-gray-300 bg-gray-50"
						>
							<Text className="text-xs text-gray-600">Start Date</Text>
							<Text className="text-sm text-gray-900">{formatDateLabel(startDate)}</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							onPress={() => setShowEndPicker(true)} 
							className="flex-1 px-3 py-2 rounded border border-gray-300 bg-gray-50"
						>
							<Text className="text-xs text-gray-600">End Date</Text>
							<Text className="text-sm text-gray-900">{formatDateLabel(endDate)}</Text>
						</TouchableOpacity>
					</View>

					{/* Quick presets */}
					<View className="flex-row flex-wrap gap-2">
						<TouchableOpacity
							onPress={() => applyPreset(7)}
							className="px-3 py-1 rounded bg-gray-100"
						>
							<Text className="text-xs text-gray-700">Last 7 days</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(30)}
							className="px-3 py-1 rounded bg-gray-100"
						>
							<Text className="text-xs text-gray-700">Last 30 days</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(90)}
							className="px-3 py-1 rounded bg-gray-100"
						>
							<Text className="text-xs text-gray-700">Last 90 days</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(null)}
							className="px-3 py-1 rounded bg-blue-100"
						>
							<Text className="text-xs text-blue-700 font-medium">All Time</Text>
						</TouchableOpacity>
					</View>

					{/* Granularity for time series */}
					{activeTab === "timeseries" && (
						<View className="mt-3 pt-3 border-t border-gray-200">
							<Text className="text-xs text-gray-600 mb-2">Granularity</Text>
							<View className="flex-row space-x-2">
								<GranularityButton g="HOURLY" label="Hourly" />
								<GranularityButton g="DAILY" label="Daily" />
								<GranularityButton g="MONTHLY" label="Monthly" />
								<GranularityButton g="YEARLY" label="Yearly" />
							</View>
						</View>
					)}

					{/* Date pickers */}
					{showStartPicker && (
						<DateTimePicker
							value={startDate}
							mode="date"
							display={Platform.OS === 'ios' ? 'inline' : 'default'}
							onChange={(event, date) => {
								setShowStartPicker(false);
								if (date) {
									if (endDate && date > endDate) setEndDate(date);
									setStartDate(date);
								}
							}}
							maximumDate={endDate}
						/>
					)}
					{showEndPicker && (
						<DateTimePicker
							value={endDate}
							mode="date"
							display={Platform.OS === 'ios' ? 'inline' : 'default'}
							onChange={(event, date) => {
								setShowEndPicker(false);
								if (date) setEndDate(date);
							}}
							minimumDate={startDate}
							maximumDate={new Date()}
						/>
					)}
				</View>

				{/* Loading State */}
				{loading && (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 mb-4">
						<Text className="text-center text-gray-500">Loading statistics...</Text>
					</View>
				)}

				{/* Error State */}
				{error && (
					<View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
						<Text className="text-red-700 text-sm">{error}</Text>
					</View>
				)}

				{/* Country Statistics */}
				{!loading && !error && activeTab === "country" && countryData && (
					<View>
						{/* Summary */}
						<View className="grid grid-cols-2 gap-4 mb-4">
							<StatCard
								title="Total Countries"
								value={countryData.data.length}
								color="#3B82F6"
							/>
							<StatCard
								title="Total Views"
								value={countryData.data.reduce((sum, d) => sum + d.views, 0).toLocaleString()}
								color="#10B981"
							/>
						</View>

						{/* Map */}
						<View className="mb-4">
							<CountryMap 
								data={countryMapData} 
								title="Geographic Distribution of Views"
							/>
						</View>

						{/* Top Countries List */}
						<View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
							<Text className="text-lg font-semibold text-gray-900 mb-3">
								Top Countries
							</Text>
							<View className="space-y-2">
								{countryData.data.slice(0, 10).map((item, index) => {
									const total = countryData.data.reduce((sum, d) => sum + d.views, 0);
									const percentage = ((item.views / total) * 100).toFixed(1);
									return (
										<View key={item.country} className="flex-row items-center justify-between py-2 border-b border-gray-100">
											<View className="flex-row items-center flex-1">
												<Text className="text-gray-600 text-xs w-8">
													#{index + 1}
												</Text>
												<Text className="text-gray-900 text-sm flex-1" numberOfLines={1}>
													{COUNTRY_NAMES[item.country] || item.country}
												</Text>
											</View>
											<View className="flex-row items-center">
												<Text className="text-gray-900 text-sm mr-2">
													{item.views.toLocaleString()}
												</Text>
												<Text className="text-gray-500 text-xs">
													({percentage}%)
												</Text>
											</View>
										</View>
									);
								})}
							</View>
						</View>
					</View>
				)}

				{/* Time Series Statistics */}
				{!loading && !error && activeTab === "timeseries" && timeSeriesData && (
					<View>
						{/* Summary */}
						<View className="grid grid-cols-3 gap-3 mb-4">
							<StatCard
								title="Total Clicks"
								value={lineChartData.reduce((sum, d) => sum + d.clicks, 0).toLocaleString()}
								color="#8B5CF6"
							/>
							<StatCard
								title="Total Allows"
								value={lineChartData.reduce((sum, d) => sum + d.allows, 0).toLocaleString()}
								color="#10B981"
							/>
							<StatCard
								title="Total Blocks"
								value={lineChartData.reduce((sum, d) => sum + d.blocks, 0).toLocaleString()}
								color="#EF4444"
							/>
						</View>

						{/* Line Chart */}
						<View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
							<Text className="text-lg font-semibold text-gray-900 mb-3 text-center">
								Views over Time ({timeSeriesData.granularity})
							</Text>
							<LineChart
								data={lineChartData}
								height={280}
								rotateLabels={lineChartData.length > 6}
							/>
						</View>
					</View>
				)}

				{/* Empty state */}
				{!loading && !error && activeTab === "country" && !countryData && (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">
							No country statistics available. Please select a date range.
						</Text>
					</View>
				)}
				{!loading && !error && activeTab === "timeseries" && !timeSeriesData && (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">
							No time series data available. Please select a date range.
						</Text>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
