import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileInfoScreen() {
	const { user } = useAuth();

	if (!user) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
				<Text className="text-gray-500">No user information available</Text>
			</SafeAreaView>
		);
	}

	const InfoItem = ({ label, value, icon }: { label: string; value: string | number | undefined; icon: string }) => (
		<View className="flex-row items-center p-4 bg-white border-b border-gray-100">
			<View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-4">
				<Ionicons name={icon as any} size={20} color="#3B82F6" />
			</View>
			<View className="flex-1">
				<Text className="text-gray-500 text-sm mb-1">{label}</Text>
				<Text className="text-gray-900 font-medium text-base">{value || "N/A"}</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
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
					<InfoItem label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} icon="calendar-outline" />
				</View>

				<View className="bg-white border-t border-b border-gray-200 mb-4">
					<InfoItem label="Total Short URLs" value={user.totalShortUrls} icon="link-outline" />
					<InfoItem label="Total Clicks" value={user.totalClicks} icon="stats-chart-outline" />
					<InfoItem label="Balance" value={`${user.balance} ${user.currency}`} icon="wallet-outline" />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
