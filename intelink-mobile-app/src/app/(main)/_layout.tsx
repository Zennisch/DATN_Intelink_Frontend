import { Stack } from "expo-router";

export default function MainLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="dashboard" />
			<Stack.Screen name="short-urls" />
			<Stack.Screen name="analytics" />
			<Stack.Screen name="api-keys" />
			<Stack.Screen name="settings" />
		</Stack>
	);
}
