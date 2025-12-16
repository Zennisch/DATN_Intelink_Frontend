import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Button from "../atoms/Button";
import TextInput from "../atoms/TextInput";
import Checkbox from "../atoms/Checkbox";
import type { LoginRequest } from "../../dto/UserDTO";
import { useForm } from "../../hooks/useForm";
import { Ionicons } from '@expo/vector-icons';

interface LoginFormProps {
	onSubmit: (credentials: LoginRequest) => Promise<void>;
	loading?: boolean;
}

const validateLogin = (values: LoginRequest): Partial<LoginRequest> => {
	const errors: Partial<LoginRequest> = {};
	if (!values.username.trim()) {
		errors.username = "Username is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password must be at least 6 characters";
	}
	return errors;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [keepSignedIn, setKeepSignedIn] = useState(false);

	const { formData, errors, handleInputChange, handleSubmit, isSubmitting } =
		useForm<LoginRequest>({
			initialValues: { username: "", password: "" },
			validate: validateLogin,
			onSubmit,
			debounceMs: 500,
		});

	// Add null checks to prevent crashes
	if (!formData || !handleInputChange) {
		return (
			<View className="space-y-6">
				<View className="items-center py-8">
					<Text className="text-gray-500">Loading...</Text>
				</View>
			</View>
		);
	}

	return (
		<View className="space-y-6">
			<View className="space-y-4">
				<TextInput
					label="Username"
					placeholder="Username/Email"
					value={formData?.username || ""}
					onChangeText={handleInputChange("username")}
					error={errors?.username}
					fullWidth
				/>

				<View className="relative">
					<TextInput
						secureTextEntry={!showPassword}
						label="Password"
						placeholder="Password"
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
			</View>

			<View className="flex-row items-center justify-between">
				<Checkbox
					id="keep-signed-in"
					checked={keepSignedIn}
					onChange={setKeepSignedIn}
					label="Keep me signed in"
				/>

				<TouchableOpacity
					onPress={() => router.push("/forgot-password")}
					className="p-1"
				>
					<Text className="text-sm text-blue-600">
						Forget your password?
					</Text>
				</TouchableOpacity>
			</View>

			<Button
				onPress={handleSubmit}
				variant="primary"
				fullWidth
				size="lg"
				loading={loading || isSubmitting}
			>
				Log in
			</Button>
		</View>
	);
};
