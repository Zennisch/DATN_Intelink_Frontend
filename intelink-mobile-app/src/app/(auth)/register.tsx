import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { RegisterForm, SocialLoginSection } from "../../components/auth";
import Button from "../../components/atoms/Button";
import type { RegisterRequest } from "../../dto/request/UserRequest";

export default function RegisterScreen() {
	const { register } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleError = (error: any) => {
		if (error.code === "NETWORK_ERROR") {
			setError("Network error. Please check your connection.");
		} else if (error.response?.status === 409) {
			setError("Username or email already exists. Please try different credentials.");
		} else if (error.response?.status === 400) {
			setError("Invalid input. Please check your information and try again.");
		} else {
			setError(error.response?.data?.message || "An unexpected error occurred.");
		}
	};

	const handleRegister = async (credentials: RegisterRequest) => {
		try {
			setLoading(true);
			setError(null);

			const response = await register(credentials);

			if (response.success) {
				// Show success message
				Alert.alert(
					"✅ Đăng ký thành công!",
					`Chúng tôi đã gửi email xác thực đến ${response.email}.\n\nVui lòng kiểm tra hộp thư và xác thực tài khoản để tiếp tục.`,
					[
						{
							text: "Đồng ý",
							onPress: () => router.replace("/(auth)/login"),
							style: "default"
						}
					],
					{ cancelable: false }
				);
			} else {
				setError(response.message || "Registration failed. Please try again.");
			}
		} catch (err: any) {
			handleError(err);
			console.error("Registration error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuth2Login = (provider: "google" | "github") => {
		setLoading(true);
		Alert.alert(
			"OAuth Login",
			`Redirecting to ${provider} login...`,
			[
				{
					text: "OK",
					onPress: () => {
						setLoading(false);
					}
				}
			]
		);
	};

	const handleGoogleLogin = () => {
		setError(null);
		handleOAuth2Login("google");
	};

	const handleGitHubLogin = () => {
		setError(null);
		handleOAuth2Login("github");
	};

	const handleBackToLogin = () => {
		router.push("/(auth)/login");
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
				<View className="flex-1 justify-center px-8 py-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="mb-8">
							<Text className="text-2xl font-semibold text-gray-900 mb-2 text-center">
								Create your Intelink account
							</Text>
							<Text className="text-gray-600 text-center">
								Join thousands of users who trust Intelink for URL shortening
							</Text>
						</View>

						{error && (
							<View className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<Text className="text-sm text-red-600">{error}</Text>
							</View>
						)}

						<View className="mb-6">
							<SocialLoginSection
								onGoogleLogin={handleGoogleLogin}
								onGitHubLogin={handleGitHubLogin}
								loading={loading}
							/>
						</View>

						<View className="flex-row items-center justify-center mb-6">
							<View className="flex-1 h-px bg-gray-300" />
							<Text className="px-4 text-gray-500">OR</Text>
							<View className="flex-1 h-px bg-gray-300" />
						</View>

						<View className="mb-6">
							<RegisterForm onSubmit={handleRegister} loading={loading} />
						</View>

						<View className="mt-6">
							<Text className="text-sm text-gray-600 mb-4 text-center">
								Already have an account?
							</Text>
							<Button
								variant="outline"
								fullWidth
								size="lg"
								onPress={handleBackToLogin}
							>
								Sign in
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
