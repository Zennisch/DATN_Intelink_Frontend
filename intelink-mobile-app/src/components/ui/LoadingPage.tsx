import React from "react";
import { View, Text } from "react-native";
import { Spinner } from "./Spinner";

interface LoadingPageProps {
	message?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
	message = "Loading..." 
}) => {
	return (
		<View className="flex-1 items-center justify-center bg-white">
			<View className="items-center">
				<Spinner size="large" className="mb-4" />
				<Text className="text-lg text-gray-600">{message}</Text>
			</View>
		</View>
	);
};
