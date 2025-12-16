import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import type { ForgotPasswordRequest } from "../../dto/UserDTO";

const validateForgotPassword = (values: ForgotPasswordRequest): Partial<ForgotPasswordRequest> => {
	const errors: Partial<ForgotPasswordRequest> = {};
	
	if (!values.email.trim()) {
		errors.email = "Email is required";
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = "Email is invalid";
	}
	
	return errors;
};

export default function ForgotPasswordScreen() {
	const { forgotPassword } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<ForgotPasswordRequest>({
			initialValues: { email: "" },
			validate: validateForgotPassword,
			onSubmit: async (values) => {
				try {
					setLoading(true);
					setError(null);
					await forgotPassword(values);
					setSuccess(true);
				} catch (err: any) {
					setError(err.response?.data?.message || "Failed to send reset email");
				} finally {
					setLoading(false);
				}
			},
			debounceMs: 500,
		});

	const handleBackToLogin = () => {
		router.push("/(auth)/login");
	};

	if (success) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50">
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="text-center">
							<Text className="text-2xl font-semibold text-gray-900 mb-4">
								Check Your Email
							</Text>
							<Text className="text-gray-600 mb-6">
								We&apos;ve sent a password reset link to {formData.email}
							</Text>
							<Button
								onPress={handleBackToLogin}
								variant="primary"
								fullWidth
								size="lg"
							>
								Back to Login
							</Button>
						</View>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="text-center mb-8">
							<Text className="text-2xl font-semibold text-gray-900 mb-2">
								Forgot Password?
							</Text>
							<Text className="text-gray-600">
								Enter your email and we&apos;ll send you a reset link
							</Text>
						</View>

						{error && (
							<View className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<Text className="text-sm text-red-600">{error}</Text>
							</View>
						)}

						<View className="space-y-4">
							<TextInput
								label="Email"
								placeholder="Enter your email"
								value={formData.email}
								onChangeText={handleInputChange("email")}
								error={errors.email}
								keyboardType="email-address"
								autoCapitalize="none"
								fullWidth
							/>

							<Button
								onPress={handleSubmit}
								variant="primary"
								fullWidth
								size="lg"
								loading={loading || isSubmitting}
							>
								Send Reset Link
							</Button>

							<TouchableOpacity onPress={handleBackToLogin} className="mt-4">
								<Text className="text-center text-blue-600 font-medium">
									Back to Login
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
