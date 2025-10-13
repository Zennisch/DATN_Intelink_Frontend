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
import type { LoginRequest } from "../../dto/request/UserRequest";

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
			
			// For demo purposes, allow any username/password combination
			// In real app, this would call the actual login API
			await login({
				username: formData.username || "demo_user",
				password: formData.password || "demo123"
			});
			
			router.replace("/(main)/dashboard");
		} catch (err: unknown) {
			handleError(err);
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuth2Login = (provider: "google" | "github") => {
		setLoading(true);
		// For mobile, we'll use WebBrowser for OAuth
		// This is a simplified implementation
		Alert.alert(
			"OAuth Login",
			`Redirecting to ${provider} login...`,
			[
				{
					text: "OK",
					onPress: () => {
						// In a real app, you would use WebBrowser.openBrowserAsync
						// and handle the callback URL
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

	const handleSignUp = () => {
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

						<View className="space-y-6">
							<View className="flex-1">
								{/* Login Form */}
								<View className="space-y-4">
									<TextInput
										label="Username"
										placeholder="Username/Email"
										value={formData.username}
										onChangeText={handleInputChange("username")}
										error={errors.username}
										fullWidth
									/>

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

								<View className="flex-row items-center justify-between my-4">
									<Checkbox
										id="keep-signed-in"
										checked={keepSignedIn}
										onChange={setKeepSignedIn}
										label="Keep me signed in"
									/>

									<Text
										onPress={() => router.push("/(auth)/forgot-password")}
										className="text-sm text-blue-600"
									>
										Forget your password?
									</Text>
								</View>

								<Button
									onPress={handleLogin}
									variant="primary"
									fullWidth
									size="lg"
									loading={loading}
								>
									Log in
								</Button>

								<Text className="text-sm text-gray-600 my-4 text-center">
									Don&apos;t have an account?
								</Text>
								<Button
									variant="outline"
									fullWidth
									size="lg"
									onPress={handleSignUp}
								>
									Sign up
								</Button>
							</View>
							
							<View className="flex-row items-center justify-center">
								<View className="flex-1 h-px bg-gray-300" />
								<Text className="px-4 text-gray-500">OR</Text>
								<View className="flex-1 h-px bg-gray-300" />
							</View>
							
							<View className="flex-1 justify-center">
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
