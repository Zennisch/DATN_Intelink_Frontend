import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/atoms/Button";
import { Ionicons } from '@expo/vector-icons';

export default function VerifyEmailScreen() {
	const router = useRouter();
	const { token } = useLocalSearchParams<{ token: string }>();
	const { verifyEmail } = useAuth();

	const [isVerifying, setIsVerifying] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const verifyToken = async () => {
			if (!token) {
				setError("Verification token is missing. Please check your email link.");
				setIsVerifying(false);
				return;
			}

			try {
				await verifyEmail(token);
				setIsSuccess(true);
				setError(null);
			} catch (err: any) {
				const errorMessage = err?.response?.data?.message || "Failed to verify email. The link may be invalid or expired.";
				setError(errorMessage);
				setIsSuccess(false);
			} finally {
				setIsVerifying(false);
			}
		};

		verifyToken();
	}, [token, verifyEmail]);

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
				<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 items-center">
					{isVerifying ? (
						<>
							<ActivityIndicator size="large" color="#4F46E5" className="mb-6" />
							<Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
								Verifying your email
							</Text>
							<Text className="text-gray-600 text-center">
								Please wait while we verify your email address...
							</Text>
						</>
					) : isSuccess ? (
						<>
							<View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-6">
								<Ionicons name="checkmark" size={32} color="#16A34A" />
							</View>
							<Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
								Email verified!
							</Text>
							<Text className="text-gray-600 text-center mb-8">
								Your email has been successfully verified. You can now access all features.
							</Text>
							<Button
								onPress={() => router.replace("/(auth)/login")}
								variant="primary"
								fullWidth
								size="lg"
							>
								Continue to Login
							</Button>
						</>
					) : (
						<>
							<View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-6">
								<Ionicons name="alert" size={32} color="#DC2626" />
							</View>
							<Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
								Verification Failed
							</Text>
							<Text className="text-gray-600 text-center mb-8">
								{error}
							</Text>
							<Button
								onPress={() => router.replace("/(auth)/login")}
								variant="outline"
								fullWidth
								size="lg"
							>
								Back to Login
							</Button>
						</>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
