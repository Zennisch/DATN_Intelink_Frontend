import { Stack } from "expo-router";
import { View } from "react-native";
import '@/global.css'
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
// import { NetworkStatus } from '../components/NetworkStatus';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <View className="flex-1">
          {/* <NetworkStatus /> */}
          <Stack />
        </View>
      </AuthProvider>
    </ErrorBoundary>
  );
}
