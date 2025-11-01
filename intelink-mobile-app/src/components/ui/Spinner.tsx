import React from "react";
import { View, ActivityIndicator } from "react-native";

interface SpinnerProps {
	size?: "small" | "large";
	color?: string;
	className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
	size = "large", 
	color = "#3B82F6",
	className = ""
}) => {
	return (
		<View className={`items-center justify-center ${className}`}>
			<ActivityIndicator size={size} color={color} />
		</View>
	);
};
