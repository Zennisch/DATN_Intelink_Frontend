import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../hooks/useSubscription';
import Button from '../../components/atoms/Button';
import Checkbox from '../../components/atoms/Checkbox';

export default function SubscriptionCostScreen() {
	const { planId } = useLocalSearchParams<{ planId: string }>();
	const router = useRouter();
	const { costInfo, loading, error, fetchCost, registerSubscription, clearError } = useSubscription();
	const [applyImmediately, setApplyImmediately] = useState(false);
	const [registering, setRegistering] = useState(false);

	useEffect(() => {
		if (planId) {
			fetchCost(Number(planId), applyImmediately);
		}
	}, [planId, applyImmediately, fetchCost]);

	const handleRegister = async () => {
		if (!planId) return;

		try {
			setRegistering(true);
			console.log('[SubscriptionCost] Registering subscription:', {
				planId: Number(planId),
				applyImmediately
			});
			
			const response = await registerSubscription(Number(planId), applyImmediately);
			
			console.log('[SubscriptionCost] Registration response:', response);
			console.log('[SubscriptionCost] Payment URL:', response.paymentUrl);
			
			if (response.paymentUrl && response.paymentUrl !== '') {
				// Mở VNPay trong browser
				console.log('[SubscriptionCost] Opening VNPay URL...');
				await Linking.openURL(response.paymentUrl);
				// Quay về dashboard
				router.replace('/dashboard');
			} else {
				// Không cần thanh toán, quay về dashboard
				console.log('[SubscriptionCost] No payment needed, returning to dashboard');
				router.replace('/dashboard');
			}
		} catch (err: any) {
			console.error('[SubscriptionCost] Registration error:', err);
			console.error('[SubscriptionCost] Error response:', err.response?.data);
		} finally {
			setRegistering(false);
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
						Subscription Cost
					</Text>
					<Text className="text-gray-600">
						Review your subscription details before payment
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

				{/* Apply Immediately Option */}
				<View className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-200">
					<View className="flex-row items-center">
						<Checkbox
							checked={applyImmediately}
							onChange={setApplyImmediately}
							disabled={loading}
						/>
						<Text className="ml-3 text-gray-700 flex-1">
							Apply immediately (cancel current subscription)
						</Text>
					</View>
					<Text className="text-sm text-gray-500 mt-2 ml-9">
						If checked, your current subscription will be cancelled and the new plan will start immediately.
					</Text>
				</View>

				{/* Loading State */}
				{loading ? (
					<View className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
						<Text className="text-center text-gray-500">Loading cost information...</Text>
					</View>
				) : costInfo ? (
					<View className="space-y-4">
						{/* Cost Breakdown */}
						<View className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
							<Text className="text-xl font-bold text-gray-900 mb-4">
								Cost Breakdown
							</Text>

							<View className="space-y-3">
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Plan Price</Text>
									<Text className="font-semibold text-gray-900">
										{costInfo.planPrice.toLocaleString()} {costInfo.currency}
									</Text>
								</View>

								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Pro-rate Value</Text>
									<Text className="font-semibold text-gray-900">
										{costInfo.proRateValue.toLocaleString()} {costInfo.currency}
									</Text>
								</View>

								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Your Credit Balance</Text>
									<Text className="font-semibold text-green-600">
										{costInfo.creditBalance.toLocaleString()} {costInfo.currency}
									</Text>
								</View>

								<View className="flex-row justify-between py-3 bg-blue-50 px-4 rounded-lg mt-2">
									<Text className="text-lg font-bold text-gray-900">Amount to Pay</Text>
									<Text className="text-lg font-bold text-blue-600">
										{costInfo.amountToPay.toLocaleString()} {costInfo.currency}
									</Text>
								</View>
							</View>
						</View>

						{/* Additional Info */}
						<View className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
							<View className="flex-row items-start mb-3">
								<Ionicons name="calendar" size={20} color="#3B82F6" style={{ marginRight: 12, marginTop: 2 }} />
								<View className="flex-1">
									<Text className="text-gray-600 text-sm mb-1">Start Date</Text>
									<Text className="font-semibold text-gray-900">{costInfo.startDate}</Text>
								</View>
							</View>

							{costInfo.message && (
								<View className="flex-row items-start">
									<Ionicons name="information-circle" size={20} color="#3B82F6" style={{ marginRight: 12, marginTop: 2 }} />
									<View className="flex-1">
										<Text className="text-gray-600 text-sm mb-1">Note</Text>
										<Text className="text-gray-900">{costInfo.message}</Text>
									</View>
								</View>
							)}
						</View>

						{/* Payment Notice */}
						<View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
							<View className="flex-row items-start">
								<Ionicons name="warning" size={20} color="#F59E0B" style={{ marginRight: 12, marginTop: 2 }} />
								<Text className="flex-1 text-sm text-yellow-800">
									You will be redirected to VNPay to complete the payment. After successful payment, you will be returned to the app.
								</Text>
							</View>
						</View>

						{/* Register Button */}
						<Button
							onPress={handleRegister}
							disabled={registering || loading}
							loading={registering}
							variant="primary"
							className="w-full"
						>
							{registering ? 'Processing...' : 'Proceed to Payment'}
						</Button>
					</View>
				) : null}
			</ScrollView>
		</SafeAreaView>
	);
}
