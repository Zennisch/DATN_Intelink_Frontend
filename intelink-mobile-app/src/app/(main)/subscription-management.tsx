import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/atoms/Button';

export default function SubscriptionManagementScreen() {
	const router = useRouter();
	const { user, refreshUser } = useAuth();
	const { 
		cancelSubscription,
		getAllSubscriptions,
		subscriptions: historySubscriptions
	} = useSubscription();
	const [cancellingId, setCancellingId] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [historyLoading, setHistoryLoading] = useState(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				setHistoryLoading(true);
				await getAllSubscriptions();
			} catch (err) {
				console.error('Failed to fetch subscription history', err);
			} finally {
				setHistoryLoading(false);
			}
		};
		fetchHistory();
	}, []);

	// Get current subscription from user object
	const currentSubscription = user?.currentSubscription;

	const handleCancelSubscription = (subscriptionId: string) => {
		Alert.alert(
			'Cancel Subscription',
			'Are you sure you want to cancel this subscription? You will lose access to premium features at the end of the billing period.',
			[
				{
					text: 'No, Keep It',
					style: 'cancel'
				},
				{
					text: 'Yes, Cancel',
					style: 'destructive',
					onPress: async () => {
						try {
							setCancellingId(subscriptionId);
							await cancelSubscription(subscriptionId);
							await refreshUser?.();
							Alert.alert('Success', 'Subscription cancelled successfully');
						} catch {
							Alert.alert('Error', 'Failed to cancel subscription');
						} finally {
							setCancellingId(null);
						}
					}
				}
			]
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return { bg: 'bg-green-100', text: 'text-green-800' };
			case 'PENDING':
				return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
			case 'EXPIRED':
				return { bg: 'bg-red-100', text: 'text-red-800' };
			case 'CANCELLED':
				return { bg: 'bg-gray-100', text: 'text-gray-800' };
			default:
				return { bg: 'bg-gray-100', text: 'text-gray-800' };
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Back Button */}
				<TouchableOpacity
					onPress={() => router.back()}
					className="flex-row items-center mb-6"
				>
					<Ionicons name="arrow-back" size={24} color="#3B82F6" />
					<Text className="text-blue-600 ml-2 text-lg font-medium">Back</Text>
				</TouchableOpacity>

				{/* Header */}
				<View className="mb-6">
					<Text className="text-3xl font-bold text-gray-900 mb-2">
						Subscription Management
					</Text>
					<Text className="text-gray-600">
						Manage your subscription and view history
					</Text>
				</View>

				{/* Error Display */}
				{error && (
					<View className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-row items-center justify-between">
						<Text className="text-red-700 flex-1">{error}</Text>
						<TouchableOpacity onPress={clearError} className="ml-2">
							<Ionicons name="close" size={20} color="#DC2626" />
						</TouchableOpacity>
					</View>
				)}

				{/* Current Subscription */}
				{loading && !currentSubscription ? (
					<View className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
						<Text className="text-center text-gray-500">Loading...</Text>
					</View>
				) : currentSubscription ? (
					<View className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-500 mb-6">
						<View className="flex-row items-center justify-between mb-4">
							<Text className="text-xl font-bold text-gray-900">
								Current Subscription
							</Text>
							<View className={`px-3 py-1 rounded-full ${getStatusColor(currentSubscription.status).bg}`}>
								<Text className={`text-xs font-semibold ${getStatusColor(currentSubscription.status).text}`}>
						{currentSubscription.status}
					</Text>
				</View>
			</View>

			{/* Plan Details */}
			<View className="bg-blue-50 rounded-lg p-4 mb-4">
				<Text className="text-2xl font-bold text-blue-900 mb-1">
					{currentSubscription.planType}
				</Text>
				{currentSubscription.planDescription && (
					<Text className="text-sm text-blue-700">
						{currentSubscription.planDescription}
					</Text>
				)}
			</View>						{/* Subscription Info */}
						<View className="space-y-3 mb-4">
							<View className="flex-row justify-between py-2 border-b border-gray-100">
								<Text className="text-gray-600">Start Date</Text>
								<Text className="font-medium text-gray-900">
									{formatDate(currentSubscription.startsAt)}
								</Text>
							</View>

							{currentSubscription.expiresAt && (
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Expires</Text>
									<Text className="font-medium text-gray-900">
										{formatDate(currentSubscription.expiresAt)}
									</Text>
								</View>
							)}

				<View className="flex-row justify-between py-2">
					<Text className="text-gray-600">Max URLs</Text>
					<Text className="font-semibold text-green-600">
						{currentSubscription.maxShortUrls === -1 ? 'Unlimited' : currentSubscription.maxShortUrls}
					</Text>
				</View>
			</View>			{/* Features */}
			<View className="bg-gray-50 rounded-lg p-4 mb-4">
				<Text className="font-semibold text-gray-900 mb-3">Features</Text>
				<View className="space-y-2">
					<View className="flex-row items-center">
						<Ionicons
							name={currentSubscription.shortCodeCustomizationEnabled ? 'checkmark-circle' : 'close-circle'}
							size={20}
							color={currentSubscription.shortCodeCustomizationEnabled ? '#10B981' : '#EF4444'}
							style={{ marginRight: 8 }}
						/>
						<Text className="text-gray-700">Custom short codes</Text>
					</View>
					<View className="flex-row items-center">
						<Ionicons
							name={currentSubscription.statisticsEnabled ? 'checkmark-circle' : 'close-circle'}
							size={20}
							color={currentSubscription.statisticsEnabled ? '#10B981' : '#EF4444'}
							style={{ marginRight: 8 }}
						/>
						<Text className="text-gray-700">Statistics</Text>
					</View>
					<View className="flex-row items-center">
						<Ionicons
							name={currentSubscription.customDomainEnabled ? 'checkmark-circle' : 'close-circle'}
							size={20}
							color={currentSubscription.customDomainEnabled ? '#10B981' : '#EF4444'}
							style={{ marginRight: 8 }}
						/>
						<Text className="text-gray-700">Custom domain</Text>
					</View>
					<View className="flex-row items-center">
						<Ionicons
							name={currentSubscription.apiAccessEnabled ? 'checkmark-circle' : 'close-circle'}
							size={20}
							color={currentSubscription.apiAccessEnabled ? '#10B981' : '#EF4444'}
							style={{ marginRight: 8 }}
						/>
						<Text className="text-gray-700">API access</Text>
					</View>
				</View>
			</View>						{/* Actions */}
						<View className="space-y-3">
							{/* Disable upgrade if already have active non-FREE subscription */}
							{currentSubscription.status === 'ACTIVE' && currentSubscription.planType !== 'FREE' ? (
								<View className="bg-gray-100 rounded-lg p-4">
									<Text className="text-gray-600 text-center font-medium">
										You already have an active {currentSubscription.planType} plan
									</Text>
									<Text className="text-gray-500 text-center text-sm mt-1">
										Expires: {currentSubscription.expiresAt ? formatDate(currentSubscription.expiresAt) : 'Never'}
									</Text>
								</View>
							) : (
								<Button
									onPress={() => router.push('/subscription-plans')}
									variant="primary"
									className="w-full"
								>
									Upgrade Plan
								</Button>
							)}
							
						{currentSubscription.status === 'ACTIVE' && currentSubscription.planType !== 'FREE' && (
							<Button
									onPress={() => handleCancelSubscription(currentSubscription.id)}
									variant="secondary"
									loading={cancellingId === currentSubscription.id}
									disabled={cancellingId === currentSubscription.id}
									className="w-full"
								>
									Cancel Subscription
								</Button>
							)}
						</View>
					</View>
				) : (
					<View className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
						<View className="items-center">
							<Ionicons name="information-circle" size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
							<Text className="text-gray-900 font-semibold text-lg mb-2">
								No Active Subscription
							</Text>
							<Text className="text-gray-600 text-center mb-6">
								Subscribe to a plan to unlock premium features
							</Text>
							<Button
								onPress={() => router.push('/subscription-plans')}
								variant="primary"
								className="w-full"
							>
								View Plans
							</Button>
						</View>
					</View>
				)}

				{/* Subscription History */}
				<View className="mb-6">
					<Text className="text-xl font-bold text-gray-900 mb-4">
						Subscription History
					</Text>

					{historyLoading ? (
						<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
							<Text className="text-center text-gray-500">Loading history...</Text>
						</View>
					) : historySubscriptions.length === 0 ? (
						<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
							<Text className="text-center text-gray-500">
								No subscription history
							</Text>
						</View>
					) : (
						<View className="space-y-3">
							{historySubscriptions.map((subscription) => (
								<View
									key={subscription.id}
									className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
								>
									<View className="flex-row items-center justify-between mb-3">
										<Text className="font-semibold text-gray-900">
											{subscription.planType || 'Unknown Plan'}
										</Text>
										<View className={`px-3 py-1 rounded-full ${getStatusColor(subscription.status).bg}`}>
											<Text className={`text-xs font-semibold ${getStatusColor(subscription.status).text}`}>
												{subscription.status}
											</Text>
										</View>
									</View>

									<View className="space-y-2">
										<View className="flex-row justify-between">
											<Text className="text-sm text-gray-600">Start Date:</Text>
											<Text className="text-sm text-gray-900">
												{subscription.activatedAt ? formatDate(subscription.activatedAt) : '-'}
											</Text>
										</View>

										{subscription.expiresAt && (
											<View className="flex-row justify-between">
												<Text className="text-sm text-gray-600">Expires:</Text>
												<Text className="text-sm text-gray-900">
													{formatDate(subscription.expiresAt)}
												</Text>
											</View>
										)}

										<View className="flex-row justify-between">
											<Text className="text-sm text-gray-600">Price:</Text>
											<Text className="text-sm font-medium text-green-600">
												{subscription.planDetails?.price ? `${subscription.planDetails.price.toLocaleString()} VND` : 'Free'}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
