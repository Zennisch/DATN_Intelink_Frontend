import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/atoms/Button';
import { canAccessStatistics } from '../../utils/subscriptionUtils';
import { useStatistics } from '../../hooks/useStatistics';
import { DimensionType as DT } from '../../services/ShortUrlService';

export default function UrlStatsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ shortcode?: string }>();
  const shortcode = params?.shortcode || '';

  // Permission check for statistics access
  const statisticsPermission = canAccessStatistics(user);
  if (!statisticsPermission.allowed) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="stats-chart" size={64} color="#9CA3AF" />
          <Text className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Statistics Locked
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            {statisticsPermission.reason}
          </Text>
          <Button
            onPress={() => router.push('/subscription-plans')}
            variant="primary"
          >
            Upgrade Plan
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const dimensionTypes = [
    DT.REFERRER,
    DT.REFERRER_TYPE,
    DT.UTM_SOURCE,
    DT.UTM_MEDIUM,
    DT.UTM_CAMPAIGN,
    DT.COUNTRY,
    DT.CITY,
    DT.BROWSER,
    DT.OS,
    DT.DEVICE_TYPE,
  ];

  const { data, loading, error, refetch } = useStatistics(shortcode, dimensionTypes);

  const Section = ({ title, items }: { title: string; items: { name: string; clicks: number; percentage: number }[] }) => (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
      <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
      {items.length === 0 ? (
        <Text className="text-gray-500">No data</Text>
      ) : (
        items.map((it, idx) => (
          <View key={idx} className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <Text className="text-gray-800 flex-1" numberOfLines={1}>{it.name}</Text>
            <Text className="text-gray-600 w-16 text-right">{it.clicks}</Text>
            <Text className="text-gray-500 w-16 text-right">{it.percentage}%</Text>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="chevron-back" size={20} color="#374151" />
            <Text className="text-gray-700 ml-1">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refetch()}>
            <Ionicons name="refresh" size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
        {error ? (
          <View className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <Text className="text-red-700">{error}</Text>
          </View>
        ) : null}

        {loading && !data ? (
          <View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <Text className="text-center text-gray-500">Loading...</Text>
          </View>
        ) : null}

        {data && (
          <>
            {dimensionTypes.map((dt) => (
              <Section key={dt} title={dt} items={data[dt]?.data || []} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
