import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscription } from '../../hooks/useSubscription';
import { usePayment } from '../../hooks/usePayment';
import Button from '../../components/atoms/Button';
import type { CalculateCostResponse } from '../../dto/SubscriptionDTO';

export default function SubscriptionCostScreen() {
	const { planId } = useLocalSearchParams<{ planId: string }>();
	const router = useRouter();
	const { calculateCost, createSubscription } = useSubscription();
	const { createVNPayPayment } = usePayment();
	
	const [costDetails, setCostDetails] = useState<CalculateCostResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [registering, setRegistering] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCost = async () => {
			if (!planId) return;
			try {
				setLoading(true);
				const response = await calculateCost({ planId: Number(planId) });
				setCostDetails(response);
			} catch (err: any) {
				console.error('Failed to calculate cost:', err);
				setError(err.message || 'Failed to load subscription details');
			} finally {
				setLoading(false);
			}
		};

		fetchCost();
	}, [planId, calculateCost]);

	const handleRegister = async () => {
		if (!planId || !costDetails) return;

		try {
			setRegistering(true);
			
			// 1. Create Subscription
			const subResponse = await createSubscription({ planId: Number(planId) });
			
			// 2. Create VNPay Payment
			const paymentResponse = await createVNPayPayment({
				subscriptionId: subResponse.id,
				amount: costDetails.finalCost,
				currency: 'VND'
			});
			
			if (paymentResponse.paymentUrl) {
				// Open VNPay in browser
				await Linking.openURL(paymentResponse.paymentUrl);
				// Return to dashboard
				router.replace('/dashboard');
			} else {
				Alert.alert('Error', 'No payment URL returned');
			}
		} catch (err: any) {
			console.error('Registration error:', err);
			Alert.alert('Error', err.message || 'Failed to process subscription');
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
						<TouchableOpacity onPress={() => setError(null)} className="ml-2">
							<Ionicons name="close" size={20} color="#DC2626" />
						</TouchableOpacity>
					</View>
				)}

				{loading ? (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">Loading details...</Text>
					</View>
				) : costDetails ? (
					<View className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
						<Text className="text-xl font-bold text-gray-900 mb-4">
							{costDetails.planType} Plan
						</Text>
						
						<View className="space-y-3">
							<View className="flex-row justify-between">
								<Text className="text-gray-600">Plan Price</Text>
								<Text className="font-medium text-gray-900">
									{costDetails.planPrice.toLocaleString()} VND
								</Text>
							</View>
							
							<View className="flex-row justify-between">
								<Text className="text-gray-600">Duration</Text>
								<Text className="font-medium text-gray-900">
									{costDetails.durationDays} days
								</Text>
							</View>

							{costDetails.proratedCredit > 0 && (
								<View className="flex-row justify-between">
									<Text className="text-green-600">Unused Credit</Text>
									<Text className="font-medium text-green-600">
										-{costDetails.proratedCredit.toLocaleString()} VND
									</Text>
								</View>
							)}

							<View className="h-px bg-gray-200 my-2" />

							<View className="flex-row justify-between items-center">
								<Text className="text-lg font-bold text-gray-900">Total</Text>
								<Text className="text-2xl font-bold text-blue-600">
									{costDetails.finalCost.toLocaleString()} VND
								</Text>
							</View>
						</View>
					</View>
				) : null}

				<Button
					onPress={handleRegister}
					loading={registering}
					disabled={loading || !!error || !costDetails}
					variant="primary"
					className="w-full"
				>
					Proceed to Payment
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
}
