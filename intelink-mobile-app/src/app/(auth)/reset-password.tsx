import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import type { ResetPasswordRequest } from "../../dto/UserDTO";

const validateResetPassword = (values: ResetPasswordRequest): Partial<ResetPasswordRequest> => {
	const errors: Partial<ResetPasswordRequest> = {};
	
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 8) {
		errors.password = "Password must be at least 8 characters";
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = "Confirm Password is required";
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = "Passwords do not match";
	}
	
	return errors;
};

export default function ResetPasswordScreen() {
	const { resetPassword } = useAuth();
	const router = useRouter();
	const { token } = useLocalSearchParams<{ token: string }>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<ResetPasswordRequest>({
			initialValues: { password: "", confirmPassword: "" },
			validate: validateResetPassword,
			onSubmit: async (values) => {
				if (!token) {
					setError("Invalid or missing reset token");
					return;
				}
				try {
					setLoading(true);
					setError(null);
					await resetPassword(token, values);
					setSuccess(true);
					setTimeout(() => {
						router.replace("/(auth)/login");
					}, 2000);
				} catch (err: any) {
					setError(err.response?.data?.message || "Failed to reset password");
				} finally {
					setLoading(false);
				}
			},
			debounceMs: 500,
		});

	if (!token) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50">
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<Text className="text-center text-red-600">
							Invalid or missing reset token. Please request a new password reset link.
						</Text>
						<Button
							onPress={() => router.replace("/(auth)/forgot-password")}
							variant="primary"
							fullWidth
							className="mt-4"
						>
							Go to Forgot Password
						</Button>
					</View>
				</View>
			</SafeAreaView>
		);
	}

	if (success) {
		return (
			<SafeAreaView className="flex-1 bg-gray-50">
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="text-center">
							<Text className="text-2xl font-semibold text-gray-900 mb-4">
								Password Reset Successful
							</Text>
							<Text className="text-gray-600 mb-6">
								Your password has been reset successfully. Redirecting to login...
							</Text>
							<Button
								onPress={() => router.replace("/(auth)/login")}
								variant="primary"
								fullWidth
								size="lg"
							>
								Login Now
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
								Reset Password
							</Text>
							<Text className="text-gray-600">
								Enter your new password below
							</Text>
						</View>

						{error && (
							<View className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<Text className="text-sm text-red-600">{error}</Text>
							</View>
						)}

						<View className="space-y-4">
							<TextInput
								label="New Password"
								value={formData.password}
								onChangeText={(text) => handleInputChange("password", text)}
								placeholder="Enter new password"
								secureTextEntry
								error={errors.password}
							/>

							<TextInput
								label="Confirm Password"
								value={formData.confirmPassword}
								onChangeText={(text) => handleInputChange("confirmPassword", text)}
								placeholder="Confirm new password"
								secureTextEntry
								error={errors.confirmPassword}
							/>

							<Button
								onPress={handleSubmit}
								loading={loading || isSubmitting}
								variant="primary"
								fullWidth
								size="lg"
								className="mt-2"
							>
								Reset Password
							</Button>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
