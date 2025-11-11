import { Stack } from "expo-router";
import { View } from "react-native";
import '@/global.css'
import { AuthProvider } from '../contexts/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
// import { NetworkStatus } from '../components/NetworkStatus';
if (__DEV__) {
  // load dev-only logger to reduce Reanimated strict-mode noise
  import('../utils/reanimated-logger');
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <View className="flex-1">
          {/* <NetworkStatus /> */}
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </AuthProvider>
    </ErrorBoundary>
  );
}
