import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardScreen() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600">Loading...</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!user) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
				<View className="flex-1 items-center justify-center">
					<Text className="text-gray-600">No user data available</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
						Dashboard
					</Text>
					<Text className="text-gray-600 text-center">
						Welcome back, {user.displayName || user.username}!
					</Text>
				</View>

				{/* Quick Stats Card */}
				<View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Quick Stats
					</Text>
					<View className="space-y-3">
						<View className="flex-row justify-between py-2 border-b border-gray-100">
							<Text className="text-gray-600">Total Links:</Text>
							<Text className="font-medium text-gray-900">{user.totalShortUrls}</Text>
						</View>
						<View className="flex-row justify-between py-2 border-b border-gray-100">
							<Text className="text-gray-600">Total Clicks:</Text>
							<Text className="font-medium text-gray-900">{user.totalClicks}</Text>
						</View>
						<View className="flex-row justify-between py-2">
							<Text className="text-gray-600">Credit Balance:</Text>
							<Text className="font-medium text-gray-900">
								{user.creditBalance} {user.currency}
							</Text>
						</View>
					</View>
				</View>

				{/* Recent Activity Card */}
				<View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Recent Activity
					</Text>
					{user.lastLoginAt ? (
						<View>
							<Text className="text-sm text-gray-600 mb-1">Last login:</Text>
							<Text className="text-sm font-medium text-gray-900">
								{new Date(user.lastLoginAt).toLocaleString()}
							</Text>
						</View>
					) : (
						<Text className="text-sm text-gray-600">No recent activity</Text>
					)}
				</View>

				{/* Account Information Card */}
				<View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Account Information
					</Text>
					<View className="space-y-4">
						{/* Profile */}
						<View className="flex-row items-center gap-3 pb-4 border-b border-gray-100">
							{user.profilePictureUrl && (
								<View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
									{/* Note: You'll need to use Image component for actual image */}
									<View className="w-12 h-12 bg-blue-100 items-center justify-center">
										<Text className="text-blue-600 font-bold text-lg">
											{(user.displayName || user.username).charAt(0).toUpperCase()}
										</Text>
									</View>
								</View>
							)}
							<View className="flex-1">
								<Text className="font-medium text-gray-900">
									{user.displayName || user.username}
								</Text>
								<Text className="text-sm text-gray-600">{user.email}</Text>
							</View>
						</View>

						{/* Details */}
						<View className="space-y-3">
							<View className="flex-row justify-between py-1">
								<Text className="text-sm text-gray-600">Plan:</Text>
								<Text className="text-sm font-medium text-gray-900">
									{user.currentSubscription?.planType || 'Free'}
								</Text>
							</View>
							<View className="flex-row justify-between py-1">
								<Text className="text-sm text-gray-600">Links available:</Text>
								<Text className="text-sm font-medium text-gray-900">
									{(() => {
										const maxLinks = user.currentSubscription?.maxShortUrls || 10;
										const isUnlimited = maxLinks === -1;
										return isUnlimited 
											? `${user.totalShortUrls} (Unlimited)` 
											: `${user.totalShortUrls}/${maxLinks}`;
									})()}
								</Text>
							</View>
							<View className="flex-row justify-between py-1">
								<Text className="text-sm text-gray-600">Member since:</Text>
								<Text className="text-sm font-medium text-gray-900">
									{new Date(user.createdAt).toLocaleDateString()}
								</Text>
							</View>
							<View className="flex-row justify-between items-center py-1">
								<Text className="text-sm text-gray-600">Status:</Text>
								<View className={`px-2 py-1 rounded-full ${
									user.status === 'ACTIVE' 
										? 'bg-green-100' 
										: 'bg-yellow-100'
								}`}>
									<Text className={`text-xs font-medium ${
										user.status === 'ACTIVE'
											? 'text-green-800'
											: 'text-yellow-800'
									}`}>
										{user.status}
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* Upgrade Plan Card - Show if no subscription or free plan */}
				{(!user.currentSubscription || user.currentSubscription.planType === 'FREE') && (
					<TouchableOpacity
						onPress={() => router.push('/subscription-plans')}
						className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md mb-4"
						activeOpacity={0.8}
					>
						<View className="flex-row items-center justify-between">
							<View className="flex-1">
								<View className="flex-row items-center gap-2 mb-2">
									<Ionicons name="rocket" size={24} color="white" />
									<Text className="text-xl font-bold text-white">
										Upgrade Your Plan
									</Text>
								</View>
								<Text className="text-white text-sm mb-3">
									Unlock premium features and boost your productivity
								</Text>
								<View className="space-y-1">
									<View className="flex-row items-center gap-2">
										<Ionicons name="checkmark-circle" size={16} color="white" />
										<Text className="text-white text-xs">More short URLs</Text>
									</View>
									<View className="flex-row items-center gap-2">
										<Ionicons name="checkmark-circle" size={16} color="white" />
										<Text className="text-white text-xs">Custom domains</Text>
									</View>
									<View className="flex-row items-center gap-2">
										<Ionicons name="checkmark-circle" size={16} color="white" />
										<Text className="text-white text-xs">Advanced analytics</Text>
									</View>
								</View>
							</View>
							<Ionicons name="chevron-forward" size={24} color="white" />
						</View>
					</TouchableOpacity>
				)}

				{/* Manage Subscription Button - Show if has active subscription */}
				{user.currentSubscription && user.currentSubscription.planType !== 'FREE' && (
					<TouchableOpacity
						onPress={() => router.push('/subscription-management')}
						className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 flex-row items-center justify-between"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center gap-3">
							<View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
								<Ionicons name="settings" size={20} color="#3B82F6" />
							</View>
							<Text className="text-gray-900 font-medium">Manage Subscription</Text>
						</View>
						<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
					</TouchableOpacity>
				)}

				{/* Current Subscription - if user has subscription */}
				{user.currentSubscription && (
					<View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
						<Text className="text-lg font-semibold text-gray-900 mb-4">
							🎯 Current Subscription
						</Text>
						
						{/* Subscription Details Grid */}
						<View className="space-y-3 mb-4">
							<View className="bg-blue-50 p-4 rounded-lg">
								<Text className="text-sm text-blue-600 font-medium mb-1">Plan Type</Text>
								<Text className="text-lg font-semibold text-blue-900">
									{user.currentSubscription.planType}
								</Text>
								<Text className="text-xs text-blue-700">
									{user.currentSubscription.planDescription}
								</Text>
							</View>
							
							<View className="flex-row space-x-3">
								<View className="flex-1 bg-green-50 p-4 rounded-lg">
									<Text className="text-sm text-green-600 font-medium mb-1">Status</Text>
									<Text className="text-base font-semibold text-green-900">
										{user.currentSubscription.active ? 'Active' : 'Inactive'}
									</Text>
									<Text className="text-xs text-green-700">
										{user.currentSubscription.status}
									</Text>
								</View>
								
								<View className="flex-1 bg-purple-50 p-4 rounded-lg">
									<Text className="text-sm text-purple-600 font-medium mb-1">Start Date</Text>
									<Text className="text-base font-semibold text-purple-900">
										{new Date(user.currentSubscription.startsAt).toLocaleDateString()}
									</Text>
								</View>
							</View>

							<View className="bg-orange-50 p-4 rounded-lg">
								<Text className="text-sm text-orange-600 font-medium mb-1">Expires</Text>
								<Text className="text-lg font-semibold text-orange-900">
									{new Date(user.currentSubscription.expiresAt).toLocaleDateString()}
								</Text>
							</View>
						</View>

						{/* Features */}
						<View className="space-y-2">
							<View className="flex-row items-center gap-2">
								<View className={`w-2 h-2 rounded-full ${
									user.currentSubscription.shortCodeCustomizationEnabled ? 'bg-green-500' : 'bg-gray-300'
								}`} />
								<Text className={`text-sm ${
									user.currentSubscription.shortCodeCustomizationEnabled ? 'text-green-700' : 'text-gray-500'
								}`}>
									Custom Short Codes
								</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className={`w-2 h-2 rounded-full ${
									user.currentSubscription.statisticsEnabled ? 'bg-green-500' : 'bg-gray-300'
								}`} />
								<Text className={`text-sm ${
									user.currentSubscription.statisticsEnabled ? 'text-green-700' : 'text-gray-500'
								}`}>
									Statistics
								</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className={`w-2 h-2 rounded-full ${
									user.currentSubscription.customDomainEnabled ? 'bg-green-500' : 'bg-gray-300'
								}`} />
								<Text className={`text-sm ${
									user.currentSubscription.customDomainEnabled ? 'text-green-700' : 'text-gray-500'
								}`}>
									Custom Domain
								</Text>
							</View>
							<View className="flex-row items-center gap-2">
								<View className={`w-2 h-2 rounded-full ${
									user.currentSubscription.apiAccessEnabled ? 'bg-green-500' : 'bg-gray-300'
								}`} />
								<Text className={`text-sm ${
									user.currentSubscription.apiAccessEnabled ? 'text-green-700' : 'text-gray-500'
								}`}>
									API Access
								</Text>
							</View>
						</View>
					</View>
				)}

				{/* Password Protection Feature Demo */}
				<View className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						🔒 Password Protection Feature
					</Text>
					<Text className="text-sm text-gray-600 mb-4">
						Create short URLs with password protection for enhanced security.
					</Text>
					<View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
						<View className="flex-row gap-3">
							<View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center flex-shrink-0">
								<Text className="text-blue-600 text-lg">🔐</Text>
							</View>
							<View className="flex-1">
								<Text className="font-medium text-blue-900 mb-2">
									How it works
								</Text>
								<View className="space-y-1">
									<Text className="text-sm text-blue-700">• Create a short URL with password protection</Text>
									<Text className="text-sm text-blue-700">• Share the URL and password separately</Text>
									<Text className="text-sm text-blue-700">• Users will be redirected to unlock page</Text>
									<Text className="text-sm text-blue-700">• After entering correct password, they access the original URL</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
