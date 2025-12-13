import { Stack } from "expo-router";
import { View, LogBox } from "react-native";
import '@/global.css'
import { AuthProvider } from '../contexts/AuthContext';
import { ShortUrlProvider } from '../hooks/useShortUrl';
import { StatisticsProvider } from '../hooks/useStatistics';
import { SubscriptionProvider } from '../hooks/useSubscription';
import { PaymentProvider } from '../hooks/usePayment';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { setupNativeWindModalFix } from '../utils/nativewind-modal-fix';
import { setupAxios } from '../services/AxiosConfig';
// import { NetworkStatus } from '../components/NetworkStatus';

// Setup NativeWind Modal fix to suppress navigation context errors
setupNativeWindModalFix();

// Initialize Axios
setupAxios();

// Suppress NativeWind navigation context warnings in Modals
LogBox.ignoreLogs([
  'Couldn\'t find a navigation context',
  'Have you wrapped your app with \'NavigationContainer\'',
]);

if (__DEV__) {
  // load dev-only logger to reduce Reanimated strict-mode noise
  import('../utils/reanimated-logger');
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ShortUrlProvider>
          <StatisticsProvider>
            <SubscriptionProvider>
              <PaymentProvider>
                <View className="flex-1">
                  {/* <NetworkStatus /> */}
                  <Stack screenOptions={{ headerShown: false }} />
                </View>
              </PaymentProvider>
            </SubscriptionProvider>
          </StatisticsProvider>
        </ShortUrlProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
