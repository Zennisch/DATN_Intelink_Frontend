import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, Platform, Modal, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import { AuthService } from "../../services/AuthService";

export default function SettingsScreen() {
	const router = useRouter();
	const { logout, user } = useAuth();
	const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
	const [darkMode, setDarkMode] = React.useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSendResetLink = async () => {
		if (!user?.email) return;
		
		setLoading(true);
		try {
			await AuthService.forgotPassword({ email: user.email });
			setShowResetConfirmModal(false);
			Alert.alert("Success", "Password reset link sent. Please check your email.");
		} catch (error: any) {
			Alert.alert("Error", error.response?.data?.message || "Failed to send reset link");
		} finally {
			setLoading(false);
		}
	};

	const InfoItem = ({ label, value, icon }: { label: string; value: string | number | undefined; icon: string }) => (
		<View className="flex-row items-center p-4 bg-white border-b border-gray-100">
			<View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
				<Ionicons name={icon as any} size={20} color="#3B82F6" />
			</View>
			<View className="flex-1">
				<Text className="text-gray-500 text-sm mb-1">{label}</Text>
				<Text className="text-gray-900 font-medium text-base">{value ?? "N/A"}</Text>
			</View>
		</View>
	);

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
						subtitle="View your profile details"
						onPress={() => setShowProfileModal(true)}
					/>
					<SettingItem
						icon="key"
						title="Change Password"
						subtitle="Update your password"
						onPress={() => setShowResetConfirmModal(true)}
					/>
					{/* <SettingItem
						icon="shield-checkmark"
						title="Privacy & Security"
						subtitle="Manage your privacy settings"
						onPress={() => Alert.alert("Coming Soon", "Privacy settings will be available soon")}
					/> */}
				</View>

				{/* Preferences Section
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
				</View> */}

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
						onPress={() => router.push('/subscription-management')}
					/>
					{/* <SettingItem
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
					/> */}
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

			{/* Profile Info Modal */}
			<Modal
				visible={showProfileModal}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setShowProfileModal(false)}
			>
				<SafeAreaView className="flex-1 bg-gray-50">
					<View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
						<Text className="text-lg font-bold text-gray-900">Personal Information</Text>
						<TouchableOpacity onPress={() => setShowProfileModal(false)} className="p-2">
							<Ionicons name="close" size={24} color="#6B7280" />
						</TouchableOpacity>
					</View>
					
					{user ? (
						<ScrollView className="flex-1">
							<View className="bg-white p-6 items-center border-b border-gray-200 mb-4">
								<View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center mb-4 overflow-hidden">
									{user.profilePictureUrl ? (
										<Image source={{ uri: user.profilePictureUrl }} className="w-full h-full" />
									) : (
										<Ionicons name="person" size={48} color="#9CA3AF" />
									)}
								</View>
								<Text className="text-xl font-bold text-gray-900">{user.profileName || user.username}</Text>
								<Text className="text-gray-500">{user.email}</Text>
								<View className="flex-row mt-2">
									<View className={`px-3 py-1 rounded-full ${user.verified ? 'bg-green-100' : 'bg-yellow-100'}`}>
										<Text className={`text-xs font-medium ${user.verified ? 'text-green-800' : 'text-yellow-800'}`}>
											{user.verified ? 'Verified' : 'Unverified'}
										</Text>
									</View>
									<View className="mx-2" />
									<View className="px-3 py-1 rounded-full bg-gray-100">
										<Text className="text-xs font-medium text-gray-800 capitalize">{user.role}</Text>
									</View>
								</View>
							</View>

							<View className="bg-white border-t border-b border-gray-200 mb-4">
								<InfoItem label="Username" value={user.username} icon="person-outline" />
								<InfoItem label="Email" value={user.email} icon="mail-outline" />
								<InfoItem label="Account Status" value={user.status} icon="shield-checkmark-outline" />
								<InfoItem label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"} icon="calendar-outline" />
							</View>

							<View className="bg-white border-t border-b border-gray-200 mb-4">
								<InfoItem label="Total Short URLs" value={user.totalShortUrls ?? 0} icon="link-outline" />
								<InfoItem label="Total Clicks" value={user.totalClicks ?? 0} icon="stats-chart-outline" />
								<InfoItem label="Balance" value={`${user.balance ?? 0} ${user.currency || 'VND'}`} icon="wallet-outline" />
							</View>
						</ScrollView>
					) : (
						<View className="flex-1 justify-center items-center">
							<Text className="text-gray-500">No user information available</Text>
						</View>
					)}
				</SafeAreaView>
			</Modal>

			{/* Reset Password Confirmation Modal */}
			<Modal
				visible={showResetConfirmModal}
				animationType="fade"
				transparent={true}
				onRequestClose={() => setShowResetConfirmModal(false)}
			>
				<View className="flex-1 bg-black/50 justify-center items-center p-4">
					<View className="bg-white rounded-lg p-6 w-full max-w-sm">
						<Text className="text-xl font-semibold text-gray-900 mb-2">
							Reset Password
						</Text>
						<Text className="text-gray-600 mb-6">
							We will send a password reset link to <Text className="font-bold">{user?.email}</Text>. Do you want to continue?
						</Text>

						<View className="flex-row space-x-3">
							<Button
								onPress={() => setShowResetConfirmModal(false)}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onPress={handleSendResetLink}
								variant="primary"
								className="flex-1"
								loading={loading}
							>
								Send Link
							</Button>
						</View>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}
