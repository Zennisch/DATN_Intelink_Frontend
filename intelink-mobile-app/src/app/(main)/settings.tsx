import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
	const router = useRouter();
	const { logout } = useAuth();
	const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
	const [darkMode, setDarkMode] = React.useState(false);

	const confirmLogout = () =>
		new Promise<boolean>((resolve) => {
			if (Platform.OS === "web") {
				// Fallback cho web
				const ok = window.confirm("Are you sure you want to logout?");
				return resolve(!!ok);
			}
			Alert.alert(
				"Logout",
				"Are you sure you want to logout?",
				[
					{ text: "Cancel", style: "cancel", onPress: () => resolve(false) },
					{ text: "Logout", style: "destructive", onPress: () => resolve(true) },
				],
				{ cancelable: true }
			);
		});

	const handleLogout = async () => {
		const ok = await confirmLogout();
		if (!ok) return;

		try {
			await logout();            // xóa token/state
			router.dismissAll?.();
			router.replace("/login");  // không dùng "/(auth)/login"
		} catch (error) {
			console.error("Logout error:", error);
			Alert.alert("Error", "Logout failed. Please try again.");
		}
	};

	const SettingItem = ({
		icon,
		title,
		subtitle,
		onPress,
		rightComponent
	}: {
		icon: string;
		title: string;
		subtitle?: string;
		onPress?: () => void;
		rightComponent?: React.ReactNode;
	}) => (
		<TouchableOpacity
			onPress={onPress}
			className="flex-row items-center justify-between p-4 bg-white border-b border-gray-100"
		>
			<View className="flex-row items-center flex-1">
				<View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
					<Ionicons name={icon as any} size={20} color="#6B7280" />
				</View>
				<View className="flex-1">
					<Text className="text-gray-900 font-medium">{title}</Text>
					{subtitle && (
						<Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
					)}
				</View>
			</View>
			{rightComponent || (
				<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
			)}
		</TouchableOpacity>
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1" 
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{/* Profile Section */}
				<View className="bg-white mt-4">
					<View className="p-4 border-b border-gray-100">
						<Text className="text-lg font-semibold text-gray-900 mb-2">
							Profile
						</Text>
					</View>
					<SettingItem
						icon="person"
						title="Personal Information"
						subtitle="Update your profile details"
						onPress={() => Alert.alert("Coming Soon", "Profile editing will be available soon")}
					/>
					<SettingItem
						icon="key"
						title="Change Password"
						subtitle="Update your password"
						onPress={() => router.push("/(auth)/forgot-password")}
					/>
					<SettingItem
						icon="shield-checkmark"
						title="Privacy & Security"
						subtitle="Manage your privacy settings"
						onPress={() => Alert.alert("Coming Soon", "Privacy settings will be available soon")}
					/>
				</View>

				{/* Preferences Section */}
				<View className="bg-white mt-4">
					<View className="p-4 border-b border-gray-100">
						<Text className="text-lg font-semibold text-gray-900 mb-2">
							Preferences
						</Text>
					</View>
					<SettingItem
						icon="notifications"
						title="Notifications"
						subtitle="Manage your notification preferences"
						rightComponent={
							<Switch
								value={notificationsEnabled}
								onValueChange={setNotificationsEnabled}
								trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
								thumbColor={notificationsEnabled ? "#FFFFFF" : "#F3F4F6"}
							/>
						}
					/>
					<SettingItem
						icon="moon"
						title="Dark Mode"
						subtitle="Switch to dark theme"
						rightComponent={
							<Switch
								value={darkMode}
								onValueChange={setDarkMode}
								trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
								thumbColor={darkMode ? "#FFFFFF" : "#F3F4F6"}
							/>
						}
					/>
					<SettingItem
						icon="language"
						title="Language"
						subtitle="English"
						onPress={() => Alert.alert("Coming Soon", "Language selection will be available soon")}
					/>
				</View>

				{/* Account Section */}
				<View className="bg-white mt-4">
					<View className="p-4 border-b border-gray-100">
						<Text className="text-lg font-semibold text-gray-900 mb-2">
							Account
						</Text>
					</View>
					<SettingItem
						icon="card"
						title="Subscription"
						subtitle="Manage your subscription plan"
						onPress={() => Alert.alert("Coming Soon", "Subscription management will be available soon")}
					/>
					<SettingItem
						icon="download"
						title="Export Data"
						subtitle="Download your data"
						onPress={() => Alert.alert("Coming Soon", "Data export will be available soon")}
					/>
					<SettingItem
						icon="help-circle"
						title="Help & Support"
						subtitle="Get help and contact support"
						onPress={() => Alert.alert("Support", "Contact us at support@intelink.app")}
					/>
				</View>

				{/* Danger Zone */}
				<View className="bg-white mt-4 mb-8">
					<View className="p-4 border-b border-gray-100">
						<Text className="text-lg font-semibold text-red-600 mb-2">
							Danger Zone
						</Text>
					</View>
					<SettingItem
						icon="log-out"
						title="Logout"
						subtitle="Sign out of your account"
						onPress={handleLogout}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
