import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import Button from "../../components/atoms/Button";
import { canAccessStatistics } from "../../utils/subscriptionUtils";
import { OverviewStatisticsService, type Granularity, type DimensionType } from "../../services/OverviewStatisticsService";
import type { GeographyStatResponse, TimeSeriesStatResponse, DimensionStatResponse } from "../../dto/StatisticsDTO";
import { CountryMap } from "../../components/ui/CountryMap";
import { LineChart } from "../../components/ui/LineChart";
import { COUNTRY_NAMES } from "../../constants/constants";
import DateTimePicker from "@react-native-community/datetimepicker";

type TabType = "country" | "timeseries" | "dimension";

export default function OverviewScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("country");

	// Permission check for statistics access
	const statisticsPermission = canAccessStatistics(user);
	if (!statisticsPermission.allowed) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
				<View className="flex-1 justify-center items-center px-4">
					<Ionicons name="bar-chart" size={64} color="#9CA3AF" />
					<Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
						Overview Statistics Locked
					</Text>
					<Text className="text-gray-600 text-center mb-6">
						{statisticsPermission.reason}
					</Text>
					<Button
						onPress={() => router.push('/subscription-plans')}
						variant="primary"
					>
						Upgrade Plan
					</Button>
				</View>
			</SafeAreaView>
		);
	}

	const [countryData, setCountryData] = useState<GeographyStatResponse | null>(null);
	const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesStatResponse | null>(null);
	const [dimensionData, setDimensionData] = useState<Map<DimensionType, DimensionStatResponse | GeographyStatResponse>>(new Map());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Date range state
	const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
	const [endDate, setEndDate] = useState<Date>(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [granularity, setGranularity] = useState<Granularity>("DAILY");
	const [selectedPreset, setSelectedPreset] = useState<number | null | undefined>(30); // Track selected preset
	
	// Dimension state
	const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>(["COUNTRY"]);
	const [limit, setLimit] = useState(10);

	const DIMENSION_OPTIONS: { value: DimensionType; label: string }[] = [
		{ value: "COUNTRY", label: "Country" },
		{ value: "BROWSER", label: "Browser" },
		{ value: "OS", label: "OS" },
		{ value: "DEVICE_TYPE", label: "Device Type" },
		{ value: "CITY", label: "City" },
	];

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

		const fetchDimensionStats = async () => {
			setLoading(true);
			setError(null);
			try {
				const from = `${startDate.toISOString().split("T")[0]}T00:00:00Z`;
				const to = `${endDate.toISOString().split("T")[0]}T23:59:59Z`;
				
				const promises = selectedDimensions.map(dim =>
					OverviewStatisticsService.getDimensionStatistics(dim, from, to, limit)
				);
				const results = await Promise.all(promises);
				
				const newData = new Map<DimensionType, DimensionStatResponse | GeographyStatResponse>();
				results.forEach((result, idx) => {
					newData.set(selectedDimensions[idx], result);
				});
				setDimensionData(newData);
			} catch (err) {
				const error = err as { response?: { data?: { message?: string } } };
				setError(error.response?.data?.message || "Failed to fetch dimension statistics");
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
	}, [startDate, endDate, activeTab, granularity, selectedDimensions, limit]);

	// Convert country data to map format
	const countryMapData = useMemo(() => {
		if (!countryData) return [];
		
		const total = countryData.data.reduce((sum, d) => sum + d.clicks, 0);
		
		return countryData.data.map(item => ({
			name: item.name,
			clicks: item.clicks,
			percentage: total > 0 ? (item.clicks / total) * 100 : 0
		}));
	}, [countryData]);

	// Convert time series data to line chart format with fake allows and blocks
	const lineChartData = useMemo(() => {
		if (!timeSeriesData) return [];
		
		return timeSeriesData.data.map(item => {
			const clicks = item.clicks;
			const allows = item.allowedClicks;
			const blocks = item.blockedClicks;
			
			return {
				time: item.bucketStart,
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
		setSelectedPreset(days);
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
						className={`flex-1 px-3 py-2 rounded-lg ${
							activeTab === "country" ? 'bg-blue-600' : 'bg-gray-100'
						}`}
					>
						<Text className={`text-center font-medium text-xs ${
							activeTab === "country" ? 'text-white' : 'text-gray-700'
						}`}>
							By Country
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab("timeseries")}
						className={`flex-1 px-3 py-2 rounded-lg ${
							activeTab === "timeseries" ? 'bg-blue-600' : 'bg-gray-100'
						}`}
					>
						<Text className={`text-center font-medium text-xs ${
							activeTab === "timeseries" ? 'text-white' : 'text-gray-700'
						}`}>
							Time Series
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab("dimension")}
						className={`flex-1 px-3 py-2 rounded-lg ${
							activeTab === "dimension" ? 'bg-blue-600' : 'bg-gray-100'
						}`}
					>
						<Text className={`text-center font-medium text-xs ${
							activeTab === "dimension" ? 'text-white' : 'text-gray-700'
						}`}>
							By Dimension
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
							className={`px-3 py-1 rounded ${
								selectedPreset === 7 ? 'bg-blue-600' : 'bg-gray-100'
							}`}
						>
							<Text className={`text-xs ${
								selectedPreset === 7 ? 'text-white font-medium' : 'text-gray-700'
							}`}>
								Last 7 days
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(30)}
							className={`px-3 py-1 rounded ${
								selectedPreset === 30 ? 'bg-blue-600' : 'bg-gray-100'
							}`}
						>
							<Text className={`text-xs ${
								selectedPreset === 30 ? 'text-white font-medium' : 'text-gray-700'
							}`}>
								Last 30 days
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(90)}
							className={`px-3 py-1 rounded ${
								selectedPreset === 90 ? 'bg-blue-600' : 'bg-gray-100'
							}`}
						>
							<Text className={`text-xs ${
								selectedPreset === 90 ? 'text-white font-medium' : 'text-gray-700'
							}`}>
								Last 90 days
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => applyPreset(null)}
							className={`px-3 py-1 rounded ${
								selectedPreset === null ? 'bg-blue-600' : 'bg-gray-100'
							}`}
						>
							<Text className={`text-xs ${
								selectedPreset === null ? 'text-white font-medium' : 'text-gray-700'
							}`}>
								All Time
							</Text>
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
									setSelectedPreset(undefined); // Clear preset selection
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
								if (date) {
									setEndDate(date);
									setSelectedPreset(undefined); // Clear preset selection
								}
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
									const total = countryData.data.reduce((sum, d) => sum + d.clicks, 0);
									const percentage = ((item.clicks / total) * 100).toFixed(1);
									return (
										<View key={item.name} className="flex-row items-center justify-between py-2 border-b border-gray-100">
											<View className="flex-row items-center flex-1">
												<Text className="text-gray-600 text-xs w-8">
													#{index + 1}
												</Text>
												<Text className="text-gray-900 text-sm flex-1" numberOfLines={1}>
													{COUNTRY_NAMES[item.name] || item.name}
												</Text>
											</View>
											<View className="flex-row items-center">
												<Text className="text-gray-900 text-sm mr-2">
													{item.clicks.toLocaleString()}
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

				{/* Dimension Statistics */}
				{!loading && !error && activeTab === "dimension" && (
					<View>
						{/* Dimension Selector */}
						<View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
							<Text className="text-base font-semibold text-gray-900 mb-3">
								Select Dimensions
							</Text>
							
							{/* Action buttons */}
							<View className="flex-row space-x-2 mb-3">
								<TouchableOpacity
									onPress={() => setSelectedDimensions(DIMENSION_OPTIONS.map(d => d.value))}
									className="flex-1 px-3 py-2 rounded bg-blue-100"
								>
									<Text className="text-xs text-blue-700 text-center font-medium">
										Select All
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => setSelectedDimensions([])}
									className="flex-1 px-3 py-2 rounded bg-gray-100"
								>
									<Text className="text-xs text-gray-700 text-center font-medium">
										Clear All
									</Text>
								</TouchableOpacity>
							</View>

							{/* Dimension checkboxes - scrollable */}
							<ScrollView 
								className="max-h-48"
								showsVerticalScrollIndicator={true}
								nestedScrollEnabled={true}
							>
								<View className="space-y-2">
									{DIMENSION_OPTIONS.map(option => (
										<TouchableOpacity
											key={option.value}
											onPress={() => {
												setSelectedDimensions(prev => 
													prev.includes(option.value)
														? prev.filter(d => d !== option.value)
														: [...prev, option.value]
												);
											}}
											className="flex-row items-center py-2 px-2 rounded"
										>
											<View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
												selectedDimensions.includes(option.value)
													? 'bg-blue-600 border-blue-600'
													: 'border-gray-300'
											}`}>
												{selectedDimensions.includes(option.value) && (
													<Text className="text-white text-xs">✓</Text>
												)}
											</View>
											<Text className="text-sm text-gray-900">{option.label}</Text>
										</TouchableOpacity>
									))}
								</View>
							</ScrollView>

							{/* Limit selector */}
							<View className="mt-3 pt-3 border-t border-gray-200">
								<Text className="text-xs text-gray-600 mb-2">Top Items Limit</Text>
								<View className="flex-row space-x-2">
									{[5, 10, 15, 20].map(val => (
										<TouchableOpacity
											key={val}
											onPress={() => setLimit(val)}
											className={`px-3 py-1 rounded-full ${
												limit === val ? 'bg-blue-600' : 'bg-gray-100'
											}`}
										>
											<Text className={`text-xs ${
												limit === val ? 'text-white' : 'text-gray-700'
											}`}>
												{val}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</View>

						{/* Display selected dimensions data */}
						{selectedDimensions.length === 0 ? (
							<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
								<Text className="text-center text-gray-500">
									Please select at least one dimension to view statistics
								</Text>
							</View>
						) : (
							<View>
								{/* Bar Charts Section */}
								<View className="mb-4">
									<View className="grid grid-cols-1 gap-4">
										{selectedDimensions.map(dimension => {
											const data = dimensionData.get(dimension);
											if (!data || data.data.length === 0) return null;

											const total = data.data.reduce((sum, s) => sum + s.clicks, 0);
											const dimensionLabel = DIMENSION_OPTIONS.find(d => d.value === dimension)?.label || dimension;

											return (
												<View key={dimension} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
													<Text className="text-base font-semibold text-gray-900 mb-3">
														{dimensionLabel}
													</Text>
													
													{/* Bar chart items */}
													<View className="space-y-3">
														{data.data.map((stat, index) => {
															const percentage = total > 0 ? (stat.clicks / total) * 100 : 0;
															const displayValue = dimension === "COUNTRY" 
																? (COUNTRY_NAMES[stat.name] || stat.name)
																: stat.name;

															return (
																<View key={stat.name} className="space-y-1.5">
																	{/* Info row */}
																	<View className="flex-row items-center gap-3">
																		<Text className="text-gray-600 text-xs w-7">
																			#{index + 1}
																		</Text>
																		<Text className="flex-1 text-sm text-gray-900 truncate" numberOfLines={1}>
																			{displayValue}
																		</Text>
																		<Text className="text-xs text-gray-600 min-w-[45px] text-right">
																			{percentage.toFixed(1)}%
																		</Text>
																		<Text className="text-sm font-medium text-gray-900 min-w-[70px] text-right">
																			{stat.clicks.toLocaleString()}
																		</Text>
																	</View>
																	
																	{/* Progress bar */}
																	<View className="h-2 bg-gray-100 rounded-full overflow-hidden">
																		<View 
																			className="h-full bg-blue-600 rounded-full"
																			style={{ width: `${percentage}%` }}
																		/>
																	</View>
																</View>
															);
														})}
													</View>

													{/* Total */}
													<View className="mt-3 pt-3 border-t border-gray-200">
														<View className="flex-row justify-between items-center">
															<Text className="text-sm font-medium text-gray-700">Total</Text>
															<Text className="text-sm font-bold text-gray-900">
																{total.toLocaleString()} clicks
															</Text>
														</View>
													</View>
												</View>
											);
										})}
									</View>
								</View>

								{/* Detailed Data Tables Section */}
								<View className="mb-4">
									<Text className="text-lg font-semibold text-gray-900 mb-3">
										Detailed Data Tables
									</Text>
									<View className="space-y-4">
										{selectedDimensions.map(dimension => {
											const data = dimensionData.get(dimension);
											if (!data || data.data.length === 0) return null;

											const total = data.data.reduce((sum, s) => sum + s.clicks, 0);
											const dimensionLabel = DIMENSION_OPTIONS.find(d => d.value === dimension)?.label || dimension;

											return (
												<View key={`table-${dimension}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
													<View className="px-4 py-3 border-b border-gray-200">
														<Text className="text-base font-semibold text-gray-900">
															{dimensionLabel} - Detailed Stats
														</Text>
													</View>
													
													{/* Table header */}
													<View className="flex-row bg-gray-50 px-4 py-2 border-b border-gray-200">
														<Text className="text-xs font-medium text-gray-600 w-12">
															Rank
														</Text>
														<Text className="text-xs font-medium text-gray-600 flex-1">
															{dimensionLabel}
														</Text>
														<Text className="text-xs font-medium text-gray-600 w-16 text-right">
															%
														</Text>
														<Text className="text-xs font-medium text-gray-600 w-20 text-right">
															Clicks
														</Text>
													</View>

													{/* Table rows - scrollable */}
													<ScrollView 
														className="max-h-64"
														showsVerticalScrollIndicator={true}
														nestedScrollEnabled={true}
													>
														{data.data.map((stat, index) => {
															const percentage = total > 0 ? (stat.clicks / total) * 100 : 0;
															const displayValue = dimension === "COUNTRY" 
																? (COUNTRY_NAMES[stat.name] || stat.name)
																: stat.name;

															return (
																<View 
																	key={stat.name} 
																	className="flex-row px-4 py-2 border-b border-gray-100"
																>
																	<Text className="text-sm text-gray-600 w-12">
																		#{index + 1}
																	</Text>
																	<Text className="text-sm text-gray-900 flex-1" numberOfLines={1}>
																		{displayValue}
																	</Text>
																	<Text className="text-sm text-gray-600 w-16 text-right">
																		{percentage.toFixed(1)}%
																	</Text>
																	<Text className="text-sm font-medium text-gray-900 w-20 text-right">
																		{stat.clicks.toLocaleString()}
																	</Text>
																</View>
															);
														})}
													</ScrollView>

													{/* Table footer */}
													<View className="flex-row bg-gray-50 px-4 py-2 border-t border-gray-200">
														<Text className="text-sm font-semibold text-gray-900 flex-1">
															Total
														</Text>
														<Text className="text-sm font-semibold text-gray-900 w-20 text-right">
															{total.toLocaleString()}
														</Text>
													</View>
												</View>
											);
										})}
									</View>
								</View>
							</View>
						)}
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
