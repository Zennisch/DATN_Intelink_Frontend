import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Checkbox from "../atoms/Checkbox";
import type { RegisterRequest } from "../../dto/request/UserRequest";
import { useForm } from "../../hooks/useForm";
import { Ionicons } from '@expo/vector-icons';

// Form data includes confirmPassword for validation
interface RegisterFormData {
	username: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface RegisterFormProps {
	onSubmit: (credentials: RegisterRequest) => Promise<void>;
	loading?: boolean;
}

const validateRegister = (values: RegisterFormData): Partial<RegisterFormData> => {
	const errors: Partial<RegisterFormData> = {};

	if (!values.username.trim()) {
		errors.username = "Username is required";
	} else if (values.username.length < 3) {
		errors.username = "Username must be at least 3 characters";
	}

	if (!values.email.trim()) {
		errors.email = "Email is required";
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
		errors.email = "Please enter a valid email address";
	}

	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}

	if (!values.confirmPassword) {
		errors.confirmPassword = "Please confirm your password";
	} else if (values.password !== values.confirmPassword) {
		errors.confirmPassword = "Passwords do not match";
	}

	return errors;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	// Handler to strip confirmPassword before submitting
	const handleRegisterSubmit = async (formData: RegisterFormData) => {
		const { confirmPassword, ...credentials } = formData;
		console.log("🔍 RegisterForm - Form data before stripping:", formData);
		console.log("📤 RegisterForm - Credentials being sent to API:", credentials);
		console.log("📋 RegisterForm - Credentials keys:", Object.keys(credentials));
		await onSubmit(credentials);
	};

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<RegisterFormData>({
			initialValues: { username: "", email: "", password: "", confirmPassword: "" },
			validate: validateRegister,
			onSubmit: handleRegisterSubmit,
			debounceMs: 500,
		});

	const isFormValid =
		agreeToTerms && 
		formData.username && 
		formData.email && 
		formData.password && 
		formData.confirmPassword;

	const openURL = async (url: string) => {
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		}
	};

	if (!formData || !handleInputChange) {
		return (
			<View className="py-8">
				<View className="items-center">
					<Text className="text-gray-500">Loading...</Text>
				</View>
			</View>
		);
	}

	return (
		<View>
			<View className="mb-4">
				<TextInput
					label="Username"
					placeholder="Enter your username"
					value={formData?.username || ""}
					onChangeText={handleInputChange("username")}
					error={errors?.username}
					fullWidth
					autoCapitalize="none"
				/>
			</View>

			<View className="mb-4">
				<TextInput
					label="Email"
					placeholder="Enter your email"
					value={formData?.email || ""}
					onChangeText={handleInputChange("email")}
					error={errors?.email}
					fullWidth
					autoCapitalize="none"
					keyboardType="email-address"
				/>
			</View>

			<View className="mb-4">
				<TextInput
					secureTextEntry={!showPassword}
					label="Password"
					placeholder="Enter your password"
					value={formData?.password || ""}
					onChangeText={handleInputChange("password")}
					error={errors?.password}
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

			<View className="mb-4">
				<TextInput
					secureTextEntry={!showConfirmPassword}
					label="Confirm Password"
					placeholder="Confirm your password"
					value={formData?.confirmPassword || ""}
					onChangeText={handleInputChange("confirmPassword")}
					error={errors?.confirmPassword}
					fullWidth
					rightIcon={
						<TouchableOpacity
							onPress={() => setShowConfirmPassword(!showConfirmPassword)}
							className="p-1"
						>
							<Ionicons
								name={showConfirmPassword ? "eye-off" : "eye"}
								size={20}
								color="#6B7280"
							/>
						</TouchableOpacity>
					}
				/>
			</View>

			<View className="mb-6">
				<Checkbox
					id="agree-terms"
					checked={agreeToTerms}
					onChange={setAgreeToTerms}
					label={
						<View className="flex-row flex-wrap">
							<Text className="text-sm text-gray-600">I agree to the </Text>
							<TouchableOpacity onPress={() => openURL('https://intelink.com/terms')}>
								<Text className="text-sm text-blue-600">Terms of Service</Text>
							</TouchableOpacity>
							<Text className="text-sm text-gray-600"> and </Text>
							<TouchableOpacity onPress={() => openURL('https://intelink.com/privacy')}>
								<Text className="text-sm text-blue-600">Privacy Policy</Text>
							</TouchableOpacity>
						</View>
					}
				/>
			</View>

			<Button
				onPress={handleSubmit}
				variant="primary"
				fullWidth
				size="lg"
				loading={loading || isSubmitting}
				disabled={!isFormValid}
			>
				Create Account
			</Button>
		</View>
	);
};
