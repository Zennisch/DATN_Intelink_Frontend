import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Wrapper component to isolate Modal content from navigation context
 * This prevents NativeWind's CSS interop from trying to access navigation state
 */
interface ModalWrapperProps {
	children: React.ReactNode;
	style?: any;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, style }) => {
	return (
		<View style={[styles.container, style]}>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
