import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import { ShortUrlService } from "../../services/ShortUrlService";
import { Ionicons } from '@expo/vector-icons';

export default function UnlockUrlScreen() {
    const { shortCode } = useLocalSearchParams<{ shortCode: string }>();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [unlockInfo, setUnlockInfo] = useState<{
        success: boolean;
        message: string;
        shortCode: string;
    } | null>(null);

    const fetchUnlockInfo = useCallback(async () => {
        if (!shortCode) return;

        try {
            setPageLoading(true);
            const info = await ShortUrlService.getUnlockInfo(shortCode);
            
            if (!info.success) {
                setError(info.message || "This link does not require a password");
                setPageLoading(false);
                return;
            }

            setUnlockInfo(info);
        } catch (err: any) {
            console.error("Error fetching unlock info:", err);
            if (err.response?.status === 404) {
                setError("Link not found");
            } else if (err.response?.status === 400) {
                // URL doesn't require password, redirect to direct access
                const shortUrl = `${process.env.EXPO_PUBLIC_BACKEND_URL}/${shortCode}`;
                Linking.openURL(shortUrl);
                router.back();
                return;
            } else {
                setError("Failed to load link information");
            }
        } finally {
            setPageLoading(false);
        }
    }, [shortCode, router]);

    useEffect(() => {
        fetchUnlockInfo();
    }, [fetchUnlockInfo]);

    const handleUnlock = async () => {
        if (!password.trim()) {
            setError("Please enter the password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await ShortUrlService.unlockUrl(shortCode!, password);
            if (result.success && result.redirectUrl) {
                // Open the unlocked URL
                await Linking.openURL(result.redirectUrl);
                router.back();
            } else {
                setError(result.message || "Failed to unlock URL");
            }
        } catch (err: any) {
            console.error("Error unlocking URL:", err);
            setError("Incorrect password or URL is unavailable");
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    // Loading state
    if (pageLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100" edges={['top']}>
                <View className="flex-1 justify-center items-center p-4">
                    <View className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                        <View className="items-center">
                            <View className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
                            <Text className="text-gray-600">Loading...</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // Error state (link not found or doesn't need password)
    if (error && !unlockInfo) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
                <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}>
                    {/* Logo */}
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4">
                            <Ionicons name="link" size={32} color="white" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900">Intelink</Text>
                    </View>

                    {/* Error Card */}
                    <View className="bg-white rounded-xl shadow-lg p-8">
                        <View className="items-center">
                            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                                <Ionicons name="alert-circle" size={32} color="#DC2626" />
                            </View>
                            <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
                                {error}
                            </Text>
                            <Text className="text-gray-600 text-sm mb-6 text-center">
                                The link youre looking for might have been removed or is no longer available.
                            </Text>
                            <Button onPress={handleGoBack} variant="primary" className="w-full">
                                ← Back
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}>
                {/* Logo */}
                <View className="items-center mb-8">
                    <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4">
                        <Ionicons name="link" size={32} color="white" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-900">Intelink</Text>
                </View>

                {/* Main Card */}
                <View className="bg-white rounded-xl shadow-lg p-6">
                    {/* Lock Icon */}
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="lock-closed" size={32} color="#4B5563" />
                        </View>
                        <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
                            Protected Link
                        </Text>
                        <Text className="text-gray-600 text-sm text-center">
                            This link is password protected. Please enter the password to continue.
                        </Text>
                    </View>

                    {/* URL Info */}
                    <View className="bg-gray-50 rounded-lg p-4 mb-6">
                        <View className="flex-row items-center gap-3">
                            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                                <Ionicons name="link" size={16} color="#2563EB" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-900" numberOfLines={1}>
                                    {`${process.env.EXPO_PUBLIC_BACKEND_URL}/${shortCode}`}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {unlockInfo?.message || "This link is password protected"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Password Input */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                            Password
                        </Text>
                        <TextInput
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                            fullWidth
                        />
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                                <Text className="text-sm text-red-700 flex-1">{error}</Text>
                            </View>
                        </View>
                    )}

                    {/* Unlock Button */}
                    <Button
                        onPress={handleUnlock}
                        variant="primary"
                        loading={loading}
                        disabled={loading || !password.trim()}
                        className="w-full mb-4"
                    >
                        {loading ? "Unlocking..." : "Unlock Link"}
                    </Button>

                    {/* Back Button */}
                    <View className="pt-6 border-t border-gray-200">
                        <TouchableOpacity onPress={handleGoBack} className="items-center">
                            <Text className="text-blue-600 text-sm font-medium">
                                ← Back
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Security Note */}
                <View className="mt-6">
                    <Text className="text-xs text-gray-500 text-center">
                        🔒 This link is secured by Intelink. Your privacy is protected.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}