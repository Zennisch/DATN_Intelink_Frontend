import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { View, Text } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(main)/dashboard");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg text-gray-600">Loading...</Text>
    </View>
  );
}
