import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/atoms/Button';
import { useAuth } from '../../hooks/useAuth';

export default function PaymentCallbackScreen() {
	const router = useRouter();
	const params = useLocalSearchParams();
	const { refreshUser } = useAuth();
	const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
	const processedRef = useRef(false);

	useEffect(() => {
		if (processedRef.current) return;

		// Parse VNPay response parameters
		const vnpResponseCode = params.vnp_ResponseCode as string;
		const vnpTransactionStatus = params.vnp_TransactionStatus as string;

		if (!vnpResponseCode || !vnpTransactionStatus) return;

		processedRef.current = true;

		// VNPay response codes:
		// 00: Success
		// Other codes: Failed
		if (vnpResponseCode === '00' && vnpTransactionStatus === '00') {
			setStatus('success');
			// Refresh user data to get updated subscription
			refreshUser?.();
		} else {
			setStatus('failed');
		}
	}, [params, refreshUser]);

	const handleContinue = () => {
		if (status === 'success') {
			router.replace('/dashboard');
		} else {
			router.replace('/subscription-plans');
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<ScrollView 
				className="flex-1 px-4" 
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{status === 'processing' ? (
					// Processing State
					<View className="flex-1 items-center justify-center py-20">
						<View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
							<Ionicons name="time" size={40} color="#3B82F6" />
						</View>
						<Text className="text-2xl font-bold text-gray-900 mb-2">
							Processing...
						</Text>
						<Text className="text-gray-600 text-center">
							Please wait while we verify your payment
						</Text>
					</View>
				) : status === 'success' ? (
					// Success State
					<View className="flex-1 items-center justify-center py-10">
						{/* Success Icon */}
						<View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
							<Ionicons name="checkmark-circle" size={60} color="#10B981" />
						</View>

						{/* Success Message */}
						<Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
							Payment Successful!
						</Text>
						<Text className="text-gray-600 text-center mb-8 px-4">
							Your subscription has been activated successfully
						</Text>

						{/* Payment Details */}
						<View className="bg-white rounded-xl shadow-lg p-6 w-full mb-8 border border-green-200">
							<Text className="text-lg font-semibold text-gray-900 mb-4">
								Payment Details
							</Text>
							
							{params.vnp_TxnRef && (
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Transaction Ref:</Text>
									<Text className="font-medium text-gray-900">{params.vnp_TxnRef}</Text>
								</View>
							)}

							{params.vnp_TransactionNo && (
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Transaction No:</Text>
									<Text className="font-medium text-gray-900">{params.vnp_TransactionNo}</Text>
								</View>
							)}

							{params.vnp_Amount && (
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Amount:</Text>
									<Text className="font-semibold text-green-600">
										{(Number(params.vnp_Amount) / 100).toLocaleString()} VND
									</Text>
								</View>
							)}

							{params.vnp_OrderInfo && (
								<View className="py-2">
									<Text className="text-gray-600 mb-1">Order Info:</Text>
									<Text className="font-medium text-gray-900">{params.vnp_OrderInfo}</Text>
								</View>
							)}
						</View>

						{/* Success Features */}
						<View className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 w-full mb-8 border border-green-200">
						<Text className="font-semibold text-gray-900 mb-3">
							🎉 What&apos;s next?
						</Text>
							<View className="space-y-2">
								<View className="flex-row items-center">
									<Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginRight: 8 }} />
									<Text className="text-gray-700 flex-1">Your subscription is now active</Text>
								</View>
								<View className="flex-row items-center">
									<Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginRight: 8 }} />
									<Text className="text-gray-700 flex-1">All premium features unlocked</Text>
								</View>
								<View className="flex-row items-center">
									<Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginRight: 8 }} />
									<Text className="text-gray-700 flex-1">Check your dashboard for details</Text>
								</View>
							</View>
						</View>

						{/* Action Button */}
						<Button
							onPress={handleContinue}
							variant="primary"
							className="w-full"
						>
							Go to Dashboard
						</Button>
					</View>
				) : (
					// Failed State
					<View className="flex-1 items-center justify-center py-10">
						{/* Error Icon */}
						<View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6">
							<Ionicons name="close-circle" size={60} color="#EF4444" />
						</View>

						{/* Error Message */}
						<Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
							Payment Failed
						</Text>
					<Text className="text-gray-600 text-center mb-8 px-4">
						We couldn&apos;t process your payment. Please try again.
					</Text>						{/* Error Details */}
						<View className="bg-white rounded-xl shadow-lg p-6 w-full mb-8 border border-red-200">
							<Text className="text-lg font-semibold text-gray-900 mb-4">
								Error Details
							</Text>
							
							{params.vnp_ResponseCode && (
								<View className="flex-row justify-between py-2 border-b border-gray-100">
									<Text className="text-gray-600">Response Code:</Text>
									<Text className="font-medium text-red-600">{params.vnp_ResponseCode}</Text>
								</View>
							)}

							{params.vnp_TxnRef && (
								<View className="flex-row justify-between py-2">
									<Text className="text-gray-600">Transaction Ref:</Text>
									<Text className="font-medium text-gray-900">{params.vnp_TxnRef}</Text>
								</View>
							)}
						</View>

						{/* Help Info */}
						<View className="bg-yellow-50 rounded-xl p-4 w-full mb-8 border border-yellow-200">
							<View className="flex-row items-start">
								<Ionicons name="information-circle" size={24} color="#F59E0B" style={{ marginRight: 12 }} />
								<View className="flex-1">
									<Text className="font-semibold text-yellow-900 mb-2">
										Need help?
									</Text>
									<Text className="text-sm text-yellow-800">
										If you believe this is an error or your account was charged, please contact our support team.
									</Text>
								</View>
							</View>
						</View>

						{/* Action Buttons */}
						<View className="w-full space-y-3">
							<Button
								onPress={handleContinue}
								variant="primary"
								className="w-full"
							>
								Try Again
							</Button>
							<Button
								onPress={() => router.replace('/dashboard')}
								variant="secondary"
								className="w-full"
							>
								Back to Dashboard
							</Button>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
