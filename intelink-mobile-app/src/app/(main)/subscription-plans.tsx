import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/atoms/Button';

export default function SubscriptionPlansScreen() {
	const router = useRouter();
	const { user } = useAuth();
	const { plans, isLoading: loading, getAllPlans } = useSubscription();
	const [error, setError] = React.useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			try {
				await getAllPlans();
			} catch (e: any) {
				setError(e.message || "Failed to load plans");
			}
		};
		load();
	}, [getAllPlans]);

	const clearError = () => setError(null);

	const currentPlanType = user?.currentSubscription?.subscriptionPlan?.type;

	const handleRegister = (planId: number) => {
		router.push(`/subscription-cost/${planId}` as any);
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Header */}
				<View className="mb-6">
					<Text className="text-3xl font-bold text-gray-900 mb-2">
						Subscription Plans
					</Text>
					<Text className="text-gray-600">
						Choose the perfect plan for your needs
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

				{/* Loading State */}
				{loading && plans.length === 0 ? (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">Loading plans...</Text>
					</View>
				) : plans.length === 0 ? (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">
							No subscription plans available.
						</Text>
					</View>
				) : (
					<View className="space-y-4">
						{plans.map((plan) => {
							const isCurrent = currentPlanType === plan.type;
							const isActive = plan.active;

							return (
								<View
									key={plan.id}
									className={`bg-white rounded-xl shadow-md p-6 border-2 ${
										!isActive
											? 'border-gray-300 opacity-60'
											: isCurrent
												? 'border-green-500'
												: 'border-blue-500'
									}`}
								>
									{/* Plan Header */}
									<View className="flex-row items-center justify-between mb-4">
										<View className="flex-1">
											<Text className="text-2xl font-bold text-blue-700 uppercase mb-1">
												{plan.type}
											</Text>
											{isCurrent && (
												<View className="bg-green-100 px-3 py-1 rounded-full self-start">
													<Text className="text-green-700 text-xs font-semibold">
														Current Plan
													</Text>
												</View>
											)}
										</View>
										<View className="items-end">
											<Text className="text-3xl font-bold text-green-600">
												{plan.price.toLocaleString()}
											</Text>
											<Text className="text-sm text-gray-600">VND / {plan.billingInterval}</Text>
										</View>
									</View>

									{/* Description */}
									{plan.description && (
										<Text className="text-gray-700 mb-4">
											{plan.description}
										</Text>
									)}

									{/* Features */}
									<View className="space-y-3 mb-6">
										<View className="flex-row items-center">
											<Ionicons
												name="link"
												size={20}
												color="#3B82F6"
												style={{ marginRight: 12 }}
											/>
											<Text className="text-gray-700 flex-1">
												<Text className="font-semibold">{plan.maxShortUrls}</Text> short URLs
											</Text>
										</View>

										<View className="flex-row items-center">
											<Ionicons
												name={plan.shortCodeCustomizationEnabled ? 'checkmark-circle' : 'close-circle'}
												size={20}
												color={plan.shortCodeCustomizationEnabled ? '#10B981' : '#EF4444'}
												style={{ marginRight: 12 }}
											/>
											<Text className="text-gray-700">
												Custom short codes
											</Text>
										</View>

										<View className="flex-row items-center">
											<Ionicons
												name={plan.statisticsEnabled ? 'checkmark-circle' : 'close-circle'}
												size={20}
												color={plan.statisticsEnabled ? '#10B981' : '#EF4444'}
												style={{ marginRight: 12 }}
											/>
											<Text className="text-gray-700">
												Detailed statistics
											</Text>
										</View>

										<View className="flex-row items-center">
											<Ionicons
												name={plan.customDomainEnabled ? 'checkmark-circle' : 'close-circle'}
												size={20}
												color={plan.customDomainEnabled ? '#10B981' : '#EF4444'}
												style={{ marginRight: 12 }}
											/>
											<Text className="text-gray-700">
												Custom domain
											</Text>
										</View>

										<View className="flex-row items-center">
											<Ionicons
												name={plan.apiAccessEnabled ? 'checkmark-circle' : 'close-circle'}
												size={20}
												color={plan.apiAccessEnabled ? '#10B981' : '#EF4444'}
												style={{ marginRight: 12 }}
											/>
											<Text className="text-gray-700">
												API access
											</Text>
										</View>
									</View>

									{/* Unavailable Notice */}
									{!isActive && (
										<View className="bg-gray-100 p-3 rounded-lg mb-4">
											<Text className="text-gray-600 text-sm text-center">
												This plan is currently unavailable
											</Text>
										</View>
									)}

									{/* Register Button */}
									<Button
										onPress={() => handleRegister(plan.id)}
										disabled={isCurrent || !isActive}
										variant={isCurrent ? 'secondary' : 'primary'}
										className="w-full"
									>
										{isCurrent ? 'Current Plan' : 'Select Plan'}
									</Button>
								</View>
							);
						})}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
