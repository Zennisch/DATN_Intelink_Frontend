import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface ToastProps {
	visible: boolean;
	message: string;
	type?: "success" | "error" | "info" | "warning";
	duration?: number;
	onHide: () => void;
}

export const Toast: React.FC<ToastProps> = ({
	visible,
	message,
	type = "info",
	duration = 3000,
	onHide,
}) => {
	const opacity = React.useRef(new Animated.Value(0)).current;
	const translateY = React.useRef(new Animated.Value(-50)).current;
	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const hideToast = React.useCallback(() => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: -50,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => {
			onHide();
		});
	}, [opacity, translateY, onHide]);

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();

			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				hideToast();
			}, duration);

			return () => {
				if (timerRef.current) {
					clearTimeout(timerRef.current);
					timerRef.current = null;
				}
			};
		}
	}, [visible, duration, hideToast, opacity, translateY]);

	const getToastStyles = () => {
		switch (type) {
			case "success":
				return {
					backgroundColor: "#10B981",
					icon: "checkmark-circle" as const,
					iconColor: "#FFFFFF",
				};
			case "error":
				return {
					backgroundColor: "#EF4444",
					icon: "close-circle" as const,
					iconColor: "#FFFFFF",
				};
			case "warning":
				return {
					backgroundColor: "#F59E0B",
					icon: "warning" as const,
					iconColor: "#FFFFFF",
				};
			default:
				return {
					backgroundColor: "#3B82F6",
					icon: "information-circle" as const,
					iconColor: "#FFFFFF",
				};
		}
	};

	if (!visible) return null;

	const { backgroundColor, icon, iconColor } = getToastStyles();

	return (
		<Animated.View
			style={{
				position: "absolute",
				top: 50,
				left: 20,
				right: 20,
				zIndex: 1000,
				opacity,
				transform: [{ translateY }],
			}}
		>
			<View
				style={{ backgroundColor }}
				className="rounded-lg p-4 flex-row items-center shadow-lg"
			>
				<Ionicons name={icon} size={24} color={iconColor} />
				<Text className="text-white font-medium ml-3 flex-1">{message}</Text>
			</View>
		</Animated.View>
	);
};
