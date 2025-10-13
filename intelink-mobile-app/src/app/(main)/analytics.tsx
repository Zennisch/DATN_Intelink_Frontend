import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
	const router = useRouter();
	const { user } = useAuth();

	const StatCard = ({ title, value, icon, color }: {
		title: string;
		value: string | number;
		icon: string;
		color: string;
	}) => (
		<View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
			<View className="flex-row items-center justify-between">
				<View className="flex-1">
					<Text className="text-2xl font-bold mb-1" style={{ color }}>
						{value}
					</Text>
					<Text className="text-gray-600 text-sm">{title}</Text>
				</View>
				<View className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
					<Ionicons name={icon as any} size={24} color={color} />
				</View>
			</View>
		</View>
	);

	const ChartPlaceholder = ({ title, description }: {
		title: string;
		description: string;
	}) => (
		<View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
			<Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>
			<View className="h-40 bg-gray-100 rounded-lg items-center justify-center">
				<Ionicons name="bar-chart-outline" size={48} color="#9CA3AF" />
				<Text className="text-gray-500 mt-2">{description}</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			{/* Header */}
			<View className="bg-white border-b border-gray-200 px-4 py-3">
				<View className="flex-row items-center">
					<TouchableOpacity onPress={() => router.back()} className="mr-4">
						<Ionicons name="arrow-back" size={24} color="#374151" />
					</TouchableOpacity>
					<Text className="text-xl font-semibold text-gray-900">
						Analytics
					</Text>
				</View>
			</View>

			<ScrollView className="flex-1 px-4 py-6">
				{/* Stats Overview */}
				<View className="mb-6">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Overview
					</Text>
					<View className="grid grid-cols-2 gap-4">
						<StatCard
							title="Total URLs"
							value={user?.totalShortUrls || 0}
							icon="link"
							color="#3B82F6"
						/>
						<StatCard
							title="Total Clicks"
							value={user?.totalClicks || 0}
							icon="trending-up"
							color="#10B981"
						/>
						<StatCard
							title="This Month"
							value="0"
							icon="calendar"
							color="#F59E0B"
						/>
						<StatCard
							title="Today"
							value="0"
							icon="today"
							color="#EF4444"
						/>
					</View>
				</View>

				{/* Charts */}
				<View className="space-y-6">
					<ChartPlaceholder
						title="Click Trends"
						description="Click activity over time"
					/>
					
					<ChartPlaceholder
						title="Top URLs"
						description="Most clicked URLs"
					/>
					
					<ChartPlaceholder
						title="Geographic Distribution"
						description="Clicks by location"
					/>
					
					<ChartPlaceholder
						title="Device Types"
						description="Mobile vs Desktop clicks"
					/>
				</View>

				{/* Recent Activity */}
				<View className="bg-white rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Recent Activity
					</Text>
					<View className="space-y-3">
						{[1, 2, 3, 4, 5].map((item) => (
							<View key={item} className="flex-row items-center justify-between py-2">
								<View className="flex-row items-center">
									<View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
									<View>
										<Text className="text-gray-900 text-sm">
											URL {item} clicked
										</Text>
										<Text className="text-gray-500 text-xs">
											2 hours ago
										</Text>
									</View>
								</View>
								<Text className="text-gray-500 text-sm">+1</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
