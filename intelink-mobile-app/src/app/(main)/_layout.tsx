import { Stack } from "expo-router";
import { RouteGuard } from "../../components/RouteGuard";

export default function MainLayout() {
	return (
		<RouteGuard requireAuth>
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
		</RouteGuard>
	);
}
