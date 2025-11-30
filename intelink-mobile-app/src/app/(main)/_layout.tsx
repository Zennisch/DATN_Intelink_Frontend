import { Tabs } from "expo-router";
import { RouteGuard } from "../../components/RouteGuard";
import { Ionicons } from '@expo/vector-icons';

export default function MainLayout() {
	return (
		<RouteGuard requireAuth>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: '#2563EB',
					tabBarInactiveTintColor: '#9CA3AF',
					tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB' },
				}}
			>
				<Tabs.Screen
					name="dashboard"
					options={{
						tabBarLabel: 'Dashboard',
						tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="short-urls"
					options={{
						tabBarLabel: 'Short URLs',
						tabBarIcon: ({ color, size }) => <Ionicons name="link" color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="overview"
					options={{
						tabBarLabel: 'Overview',
						tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="statistics"
					options={{
						tabBarLabel: 'Statistics',
						tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="api-keys"
					options={{
						tabBarLabel: 'API Keys',
						tabBarIcon: ({ color, size }) => <Ionicons name="key" color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						tabBarLabel: 'Settings',
						tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
					}}
				/>
				{/* Hide legacy/non-tab routes from the tab bar */}
				<Tabs.Screen
					name="analytics"
					options={{
						href: null,
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="url-stats"
					options={{
						href: null,
						headerShown: false,
					}}
				/>
				<Tabs.Screen
					name="UnlockUrlScreen"
					options={{
						href: null,
						headerShown: false,
					}}
				/>
			</Tabs>
		</RouteGuard>
	);
}
