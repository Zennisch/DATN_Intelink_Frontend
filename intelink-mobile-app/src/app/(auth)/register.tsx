import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "../../hooks/useForm";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import type { RegisterRequest } from "../../dto/request/UserRequest";

const validateRegister = (values: RegisterRequest): Partial<RegisterRequest> => {
	const errors: Partial<RegisterRequest> = {};
	
	if (!values.username.trim()) {
		errors.username = "Username is required";
	} else if (values.username.length < 3) {
		errors.username = "Username must be at least 3 characters";
	}
	
	if (!values.email.trim()) {
		errors.email = "Email is required";
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = "Email is invalid";
	}
	
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}
	
	if (!values.confirmPassword) {
		errors.confirmPassword = "Confirm password is required";
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = "Passwords do not match";
	}
	
	return errors;
};

export default function RegisterScreen() {
	const { register } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<RegisterRequest>(
			{ username: "", email: "", password: "", confirmPassword: "" },
			validateRegister,
			async (values) => {
				try {
					setLoading(true);
					setError(null);
					await register(values);
					router.push("/(auth)/login");
				} catch (err: any) {
					setError(err.response?.data?.message || "Registration failed");
				} finally {
					setLoading(false);
				}
			},
			500,
		);

	const handleSignIn = () => {
		router.push("/(auth)/login");
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="text-center mb-8">
							<Text className="text-2xl font-semibold text-gray-900 mb-2">
								Create Account
							</Text>
							<Text className="text-gray-600">
								Join Intelink to start shortening URLs
							</Text>
						</View>

						{error && (
							<View className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<Text className="text-sm text-red-600">{error}</Text>
							</View>
						)}

						<View className="space-y-4">
							<TextInput
								label="Username"
								placeholder="Choose a username"
								value={formData.username}
								onChangeText={handleInputChange("username")}
								error={errors.username}
								fullWidth
							/>

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

							<TextInput
								secureTextEntry
								label="Password"
								placeholder="Create a password"
								value={formData.password}
								onChangeText={handleInputChange("password")}
								error={errors.password}
								fullWidth
							/>

							<TextInput
								secureTextEntry
								label="Confirm Password"
								placeholder="Confirm your password"
								value={formData.confirmPassword}
								onChangeText={handleInputChange("confirmPassword")}
								error={errors.confirmPassword}
								fullWidth
							/>

							<Button
								onPress={handleSubmit}
								variant="primary"
								fullWidth
								size="lg"
								loading={loading || isSubmitting}
							>
								Create Account
							</Button>

							<View className="flex-row justify-center items-center mt-4">
								<Text className="text-gray-600">Already have an account? </Text>
								<TouchableOpacity onPress={handleSignIn}>
									<Text className="text-blue-600 font-medium">Sign in</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
