import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

export default function OAuthCallbackScreen() {
	const router = useRouter();
	const { token, error: errorParam } = useLocalSearchParams<{ token?: string; error?: string }>();
	const { oAuthLogin } = useAuth();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const handleCallback = async () => {
			if (errorParam) {
				setError(errorParam);
				return;
			}

			if (!token) {
				setError("No token received from provider");
				return;
			}

			try {
				await oAuthLogin(token);
				router.replace("/(main)/dashboard");
			} catch (err: any) {
				setError(err.message || "Failed to complete login");
			}
		};

		handleCallback();
	}, [token, errorParam, oAuthLogin, router]);

	return (
		<SafeAreaView className="flex-1 bg-gray-50 justify-center items-center p-8">
			<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 items-center w-full max-w-sm">
				{error ? (
					<>
						<View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-6">
							<Ionicons name="alert" size={32} color="#DC2626" />
						</View>
						<Text className="text-xl font-bold text-gray-900 mb-2 text-center">
							Login Failed
						</Text>
						<Text className="text-gray-600 text-center mb-6">
							{error}
						</Text>
						<Text 
							className="text-blue-600 font-medium"
							onPress={() => router.replace("/(auth)/login")}
						>
							Back to Login
						</Text>
					</>
				) : (
					<>
						<ActivityIndicator size="large" color="#4F46E5" className="mb-6" />
						<Text className="text-xl font-bold text-gray-900 mb-2 text-center">
							Completing Login
						</Text>
						<Text className="text-gray-600 text-center">
							Please wait while we verify your credentials...
						</Text>
					</>
				)}
			</View>
		</SafeAreaView>
	);
}
