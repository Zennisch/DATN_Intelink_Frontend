import React, { useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { SocialLoginSection } from "../../components/auth";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import Checkbox from "../../components/atoms/Checkbox";
import { Ionicons } from '@expo/vector-icons';
import type { LoginRequest } from "../../dto/UserDTO";

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

export default function LoginScreen() {
	const { login } = useAuth();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<LoginRequest>({
		username: "",
		password: "",
	});
	const [errors, setErrors] = useState<Partial<LoginRequest>>({});
	const [showPassword, setShowPassword] = useState(false);
	const [keepSignedIn, setKeepSignedIn] = useState(false);

	const handleError = (error: unknown) => {
		if (error && error instanceof Error) {
			const err = error as {
				code?: string;
				response?: { status?: number; data?: { message?: string } };
			};
			if (err.code === "NETWORK_ERROR") {
				setError("Network error. Please check your connection.");
			} else if (err.response?.status === 401) {
				setError("Invalid credentials. Please try again.");
			} else {
				setError(
					err.response?.data?.message || "An unexpected error occurred.",
				);
			}
		} else {
			setError("An unexpected error occurred.");
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginRequest> = {};
		
		if (!formData.username.trim()) {
			newErrors.username = "Username is required";
		}
		
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}
		
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (field: keyof LoginRequest) => (value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: undefined }));
		}
	};

	const handleLogin = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			setLoading(true);
			setError(null);
			
			await login({
				username: formData.username,
				password: formData.password
			});
			
			router.replace("/(main)/dashboard");
		} catch (err: unknown) {
			handleError(err);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuth2Login = async (provider: "google" | "github") => {
		setLoading(true);
		try {
			const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.intelink.click';
			const redirectUri = Linking.createURL('/(auth)/oauth-callback');
			const authUrl = `${backendUrl}/auth/oauth2/authorize/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
			
			await WebBrowser.openBrowserAsync(authUrl);
			// The callback will be handled by the deep link listener in the app
		} catch (err) {
			console.error("OAuth error:", err);
			setError("Failed to initiate login");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		setError(null);
		handleOAuth2Login("google");
	};

	const handleGitHubLogin = () => {
		setError(null);
		handleOAuth2Login("github");
	};

	const handleSignUp = () => {
		console.log("🚀 Sign up button clicked - navigating to register");
		router.push("/(auth)/register");
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			<ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
				<View className="flex-1 justify-center px-8">
					<View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
						<View className="text-center mb-8">
							<Text className="text-2xl font-semibold text-gray-900 mb-2">
								Log in to Intelink
							</Text>
						</View>

						{error && (
							<View className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
								<Text className="text-sm text-red-600">{error}</Text>
							</View>
						)}

						<View>
							{/* Login Form */}
							<View>
								<View className="mb-4">
									<TextInput
										label="Username"
										placeholder="Username/Email"
										value={formData.username}
										onChangeText={handleInputChange("username")}
										error={errors.username}
										fullWidth
									/>
								</View>

								<View className="mb-4">
									<TextInput
										secureTextEntry={!showPassword}
										label="Password"
										placeholder="Password"
										value={formData.password}
										onChangeText={handleInputChange("password")}
										error={errors.password}
										fullWidth
										rightIcon={
											<TouchableOpacity
												onPress={() => setShowPassword(!showPassword)}
												className="p-1"
											>
												<Ionicons
													name={showPassword ? "eye-off" : "eye"}
													size={20}
													color="#6B7280"
												/>
											</TouchableOpacity>
										}
									/>
								</View>

								<View className="flex-row items-center justify-between mb-4">
									<Checkbox
										id="keep-signed-in"
										checked={keepSignedIn}
										onChange={setKeepSignedIn}
										label="Keep me signed in"
									/>

									<TouchableOpacity
										onPress={() => router.push("/(auth)/forgot-password")}
									>
										<Text className="text-sm text-blue-600">
											Forget your password?
										</Text>
									</TouchableOpacity>
								</View>

								<View className="mb-4">
									<Button
										onPress={handleLogin}
										variant="primary"
										fullWidth
										size="lg"
										loading={loading}
									>
										Log in
									</Button>
								</View>

								<Text className="text-sm text-gray-600 mb-3 text-center">
									Don&apos;t have an account?
								</Text>
								<View className="mb-6">
									<Button
										variant="outline"
										fullWidth
										size="lg"
										onPress={handleSignUp}
									>
										Sign up
									</Button>
								</View>
							</View>
							
							<View className="flex-row items-center justify-center mb-6">
								<View className="flex-1 h-px bg-gray-300" />
								<Text className="px-4 text-gray-500">OR</Text>
								<View className="flex-1 h-px bg-gray-300" />
							</View>
							
							<View>
								<SocialLoginSection
									onGoogleLogin={handleGoogleLogin}
									onGitHubLogin={handleGitHubLogin}
									loading={loading}
								/>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
