import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/atoms/Button";
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
	const router = useRouter();
	const { user, logout } = useAuth();

		const handleLogout = async () => {
			try {
				await logout(() => router.replace('/(auth)/login'));
			} catch (error) {
				console.error("Logout error:", error);
			}
		};

	return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Welcome Section */}
						<View className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
					<Text className="text-2xl font-bold text-gray-900 mb-2">
						Welcome back, {user?.username || 'User'}!
					</Text>
					<Text className="text-gray-600">
								Manage your short URLs and view statistics
					</Text>
				</View>

				{/* Stats Cards */}
				<View className="flex-row space-x-4 mb-6">
					<View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
						<Text className="text-3xl font-bold text-blue-600 mb-1">
							{user?.totalShortUrls || 0}
						</Text>
						<Text className="text-gray-600 text-sm">Short URLs</Text>
					</View>
					<View className="flex-1 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
						<Text className="text-3xl font-bold text-green-600 mb-1">
							{user?.totalClicks || 0}
						</Text>
						<Text className="text-gray-600 text-sm">Total Clicks</Text>
					</View>
				</View>

				{/* Quick Actions */}
				<View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Quick Actions
					</Text>
					<View className="space-y-3">
									<Button
										variant="primary"
										fullWidth
										icon={<Ionicons name="link" size={20} color="white" />}
										iconPosition="left"
														  onPress={() => router.push("/(main)/short-urls" as any)}
									>
							Manage Short URLs
						</Button>
									<Button
										variant="outline"
										fullWidth
										icon={<Ionicons name="stats-chart" size={20} color="#374151" />}
										iconPosition="left"
														  onPress={() => router.push("/(main)/statistics" as any)}
									>
										View Statistics
									</Button>
						<Button
							variant="outline"
							fullWidth
							icon={<Ionicons name="key" size={20} color="#374151" />}
							iconPosition="left"
														  onPress={() => router.push("/(main)/api-keys" as any)}
						>
							API Keys
						</Button>
													<Button
														variant="outline"
														fullWidth
														icon={<Ionicons name="log-out-outline" size={20} color="#374151" />}
														iconPosition="left"
														onPress={handleLogout}
													>
														Logout
													</Button>
									<Button
										variant="outline"
										fullWidth
										icon={<Ionicons name="settings" size={20} color="#374151" />}
										iconPosition="left"
										onPress={() => router.push("/settings")}
									>
										Settings
									</Button>
					</View>
				</View>

				{/* User Info */}
				<View className="bg-white rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Account Information
					</Text>
					<View className="space-y-2">
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Email:</Text>
							<Text className="text-gray-900">{user?.email}</Text>
						</View>
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Status:</Text>
							<Text className="text-gray-900">{user?.status}</Text>
						</View>
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Credits:</Text>
							<Text className="text-gray-900">{user?.creditBalance} {user?.currency}</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
