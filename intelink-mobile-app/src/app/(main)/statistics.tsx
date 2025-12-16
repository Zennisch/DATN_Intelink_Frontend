import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import Button from "../../components/atoms/Button";
import { canAccessStatistics } from "../../utils/subscriptionUtils";
import { useStatistics } from "../../hooks/useStatistics";
import { StatisticsService, type Granularity, type DimensionType } from "../../services/StatisticsService";
import { useShortUrl } from "../../hooks/useShortUrl";
import { BarChart } from "../../components/ui/BarChart";
import { PieChart } from "../../components/ui/PieChart";
import { CountryMap } from "../../components/ui/CountryMap";
import { LineChart } from "../../components/ui/LineChart";
import DateTimePicker from "@react-native-community/datetimepicker";
import { buildPublicShortUrl } from "../../utils/UrlUtil";
import type { ShortUrlResponse } from "../../dto/ShortUrlDTO";
import type { DimensionStatResponse, GeographyStatResponse, TimeSeriesStatResponse, PeakTimeStatResponse } from "../../dto/StatisticsDTO";

type TabType = "time" | "geography" | "dimension";

export default function StatisticsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ shortcode?: string }>();
  const initialShortcode = params?.shortcode || '';

  // Permission check
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

  // State
  const { searchShortUrls } = useShortUrl();
  const { 
    getBrowserStats, getOsStats, getDeviceStats, 
    getCountryStats, getCityStats, 
    getTimeSeriesStats, getPeakTimeStats, 
    isLoading: statsLoading 
  } = useStatistics();

  const [shortUrls, setShortUrls] = useState<ShortUrlResponse[]>([]);
  const [selectedShort, setSelectedShort] = useState<string>(initialShortcode);
  const [activeTab, setActiveTab] = useState<TabType>("time");
  
  // Time Series State
  const [granularity, setGranularity] = useState<Granularity>('DAILY');
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [timeData, setTimeData] = useState<TimeSeriesStatResponse | null>(null);
  const [peakData, setPeakData] = useState<PeakTimeStatResponse | null>(null);
  const [timeMode, setTimeMode] = useState<'REGULAR' | 'PEAK'>('REGULAR');

  // Geography State
  const [geoMode, setGeoMode] = useState<'COUNTRY' | 'CITY'>('COUNTRY');
  const [geoData, setGeoData] = useState<GeographyStatResponse | null>(null);

  // Dimension State
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionType[]>(['BROWSER']);
  const [dimensionData, setDimensionData] = useState<Record<string, DimensionStatResponse | GeographyStatResponse>>({});
  const [chartType, setChartType] = useState<'BAR' | 'PIE'>('BAR');

  const [error, setError] = useState<string | null>(null);

  // Fetch Short URLs
  useEffect(() => {
    const loadUrls = async () => {
      try {
        const res = await searchShortUrls({ page: 0, size: 20, sortBy: 'createdAt', direction: 'desc' });
        setShortUrls(res.content);
        if (!selectedShort && res.content.length > 0) {
          setSelectedShort(res.content[0].shortCode);
        }
      } catch (e) {
        console.error("Failed to load URLs", e);
      }
    };
    loadUrls();
  }, [searchShortUrls]);

  // Update selected shortcode if params change
  useEffect(() => {
    if (params?.shortcode && params.shortcode !== selectedShort) {
      setSelectedShort(params.shortcode);
    }
  }, [params?.shortcode]);

  // Fetch Statistics based on Tab and Selection
  const fetchData = useCallback(async () => {
    if (!selectedShort) return;
    setError(null);
    
    try {
      const from = startDate.toISOString();
      const to = endDate.toISOString();

      if (activeTab === 'time') {
        if (timeMode === 'REGULAR') {
          const data = await getTimeSeriesStats(selectedShort, { granularity, from, to });
          setTimeData(data);
        } else {
          const data = await getPeakTimeStats(selectedShort, { granularity, from, to });
          setPeakData(data);
        }
      } else if (activeTab === 'geography') {
        if (geoMode === 'COUNTRY') {
          const data = await getCountryStats(selectedShort);
          setGeoData(data);
        } else {
          const data = await getCityStats(selectedShort);
          setGeoData(data);
        }
      } else if (activeTab === 'dimension') {
        const newDimData: Record<string, DimensionStatResponse | GeographyStatResponse> = {};
        await Promise.all(selectedDimensions.map(async (dim) => {
          let data;
          switch (dim) {
            case 'BROWSER': data = await getBrowserStats(selectedShort); break;
            case 'OS': data = await getOsStats(selectedShort); break;
            case 'DEVICE_TYPE': data = await getDeviceStats(selectedShort); break;
            case 'COUNTRY': data = await getCountryStats(selectedShort); break;
            case 'CITY': data = await getCityStats(selectedShort); break;
          }
          if (data) newDimData[dim] = data;
        }));
        setDimensionData(newDimData);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch statistics");
      console.error(e);
    }
  }, [selectedShort, activeTab, timeMode, geoMode, selectedDimensions, granularity, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to format date
  const formatDateLabel = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Helper components
  const TabButton = ({ id, label }: { id: TabType; label: string }) => (
    <TouchableOpacity 
      onPress={() => setActiveTab(id)} 
      className={`flex-1 py-2 rounded-lg ${activeTab === id ? 'bg-blue-600' : 'bg-gray-100'}`}
    >
      <Text className={`text-center text-xs font-medium ${activeTab === id ? 'text-white' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SubTabButton = <T extends string>({ id, current, label, onSelect }: { id: T, current: T, label: string, onSelect: (v: T) => void }) => (
    <TouchableOpacity 
      onPress={() => onSelect(id)} 
      className={`px-3 py-1 rounded-full mr-2 ${current === id ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 border border-transparent'}`}
    >
      <Text className={`text-xs ${current === id ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const MultiSelectTabButton = <T extends string>({ id, selected, label, onToggle }: { id: T, selected: T[], label: string, onToggle: (v: T) => void }) => {
    const isSelected = selected.includes(id);
    return (
      <TouchableOpacity 
        onPress={() => onToggle(id)} 
        className={`px-3 py-1 rounded-full mr-2 mb-2 ${isSelected ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100 border border-transparent'}`}
      >
        <Text className={`text-xs ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const StatCard = ({ title, value, color, icon }: { title: string, value: string | number, color: string, icon?: string }) => (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex-1 min-w-[45%] mb-3">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-xs text-gray-500 mb-1">{title}</Text>
          <Text className="text-xl font-bold" style={{ color }}>{value}</Text>
        </View>
        {icon && <Ionicons name={icon as any} size={20} color={color} />}
      </View>
    </View>
  );

  // Render Content
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* URL Selector */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <Text className="text-sm font-semibold text-gray-900 mb-3">Select URL to Analyze</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            {shortUrls.map((u) => (
              <TouchableOpacity 
                key={u.shortCode} 
                onPress={() => setSelectedShort(u.shortCode)} 
                className={`mx-1 px-4 py-2 rounded-lg border ${selectedShort === u.shortCode ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
              >
                <Text className={`text-xs font-medium ${selectedShort === u.shortCode ? 'text-blue-700' : 'text-gray-700'}`}>
                  {u.shortCode}
                </Text>
                <Text className="text-[10px] text-gray-500 mt-0.5" numberOfLines={1}>
                  {u.totalClicks} clicks
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View className="p-4">
          {/* Tabs */}
          <View className="flex-row space-x-2 mb-6">
            <TabButton id="time" label="Time Series" />
            <TabButton id="geography" label="Geography" />
            <TabButton id="dimension" label="Dimensions" />
          </View>

          {/* Loading / Error */}
          {statsLoading && (
            <View className="py-8">
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          )}
          
          {error && (
            <View className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
              <Text className="text-red-700 text-sm">{error}</Text>
              <TouchableOpacity onPress={fetchData} className="mt-2">
                <Text className="text-red-700 font-medium text-xs">Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!statsLoading && !error && (
            <>
              {/* Time Series Tab */}
              {activeTab === 'time' && (
                <View>
                  <View className="flex-row mb-4">
                    <SubTabButton id="REGULAR" current={timeMode} label="Regular" onSelect={setTimeMode} />
                    <SubTabButton id="PEAK" current={timeMode} label="Peak Times" onSelect={setTimeMode} />
                  </View>

                  {timeMode === 'REGULAR' && (
                    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-base font-semibold text-gray-900">Clicks Over Time</Text>
                        <View className="flex-row">
                          {(['HOURLY', 'DAILY', 'MONTHLY', 'YEARLY'] as Granularity[]).map(g => (
                            <TouchableOpacity 
                              key={g} 
                              onPress={() => setGranularity(g)}
                              className={`px-2 py-1 ml-1 rounded ${granularity === g ? 'bg-blue-100' : 'bg-gray-100'}`}
                            >
                              <Text className={`text-[10px] ${granularity === g ? 'text-blue-700' : 'text-gray-600'}`}>{g[0]}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Date Range */}
                      <View className="flex-row space-x-2 mb-4">
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} className="flex-1 px-3 py-2 rounded border border-gray-200 bg-gray-50">
                          <Text className="text-[10px] text-gray-500">From</Text>
                          <Text className="text-xs text-gray-900">{formatDateLabel(startDate)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} className="flex-1 px-3 py-2 rounded border border-gray-200 bg-gray-50">
                          <Text className="text-[10px] text-gray-500">To</Text>
                          <Text className="text-xs text-gray-900">{formatDateLabel(endDate)}</Text>
                        </TouchableOpacity>
                      </View>

                      {timeData && (
                        <LineChart 
                          data={timeData.data.map(d => ({
                            time: d.bucketStart,
                            clicks: d.clicks,
                            allows: d.allowedClicks,
                            blocks: d.blockedClicks
                          }))}
                          height={250}
                          rotateLabels={timeData.data.length > 5}
                        />
                      )}
                    </View>
                  )}

                  {timeMode === 'PEAK' && peakData && (
                    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <Text className="text-base font-semibold text-gray-900 mb-4">Peak Traffic Times</Text>
                      <LineChart 
                        data={peakData.data.map(p => ({
                          time: p.bucketStart,
                          clicks: p.clicks,
                          allows: p.allowedClicks,
                          blocks: p.blockedClicks
                        }))}
                        height={250}
                        rotateLabels={peakData.data.length > 5}
                      />
                    </View>
                  )}

                  {/* Date Pickers */}
                  {showStartPicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(e, d) => { setShowStartPicker(false); if(d) setStartDate(d); }}
                      maximumDate={endDate}
                    />
                  )}
                  {showEndPicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(e, d) => { setShowEndPicker(false); if(d) setEndDate(d); }}
                      minimumDate={startDate}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
              )}

              {/* Geography Tab */}
              {activeTab === 'geography' && (
                <View>
                  <View className="flex-row mb-4">
                    <SubTabButton id="COUNTRY" current={geoMode} label="Countries" onSelect={setGeoMode} />
                    <SubTabButton id="CITY" current={geoMode} label="Cities" onSelect={setGeoMode} />
                  </View>

                  {geoData && (
                    <>
                      <View className="flex-row flex-wrap justify-between mb-2">
                        <StatCard title="Total Clicks" value={geoData.totalClicks} color="#3B82F6" icon="globe" />
                        <StatCard title="Allowed" value={geoData.totalAllowedClicks} color="#10B981" icon="checkmark-circle" />
                        <StatCard title="Blocked" value={geoData.totalBlockedClicks} color="#EF4444" icon="ban" />
                      </View>

                      {geoMode === 'COUNTRY' && (
                        <View className="mb-4">
                          <CountryMap 
                            data={geoData.data.map(d => ({ name: d.name, clicks: d.clicks, percentage: d.percentage }))} 
                            title="World Map" 
                          />
                        </View>
                      )}

                      <View className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                          <Text className="font-semibold text-gray-700 text-xs uppercase">
                            Top {geoMode === 'COUNTRY' ? 'Countries' : 'Cities'}
                          </Text>
                        </View>
                        {geoData.data.slice(0, 10).map((item, idx) => (
                          <View key={idx} className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-0">
                            <Text className="w-8 text-gray-400 text-xs font-medium">#{idx + 1}</Text>
                            <View className="flex-1">
                              <Text className="text-sm text-gray-900 font-medium">{item.name}</Text>
                              <View className="flex-row mt-1">
                                <View className="h-1.5 bg-blue-100 rounded-full flex-1 overflow-hidden">
                                  <View className="h-full bg-blue-500" style={{ width: `${item.percentage}%` }} />
                                </View>
                              </View>
                            </View>
                            <View className="ml-4 items-end">
                              <Text className="text-sm font-bold text-gray-900">{item.clicks}</Text>
                              <Text className="text-[10px] text-gray-500">{item.percentage.toFixed(1)}%</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* Dimensions Tab */}
              {activeTab === 'dimension' && (
                <View>
                  <View className="flex-row flex-wrap mb-4">
                    <MultiSelectTabButton id="BROWSER" selected={selectedDimensions} label="Browser" onToggle={(id) => setSelectedDimensions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                    <MultiSelectTabButton id="OS" selected={selectedDimensions} label="OS" onToggle={(id) => setSelectedDimensions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                    <MultiSelectTabButton id="DEVICE_TYPE" selected={selectedDimensions} label="Device" onToggle={(id) => setSelectedDimensions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                    <MultiSelectTabButton id="COUNTRY" selected={selectedDimensions} label="Country" onToggle={(id) => setSelectedDimensions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                    <MultiSelectTabButton id="CITY" selected={selectedDimensions} label="City" onToggle={(id) => setSelectedDimensions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} />
                  </View>

                  {selectedDimensions.map(dim => {
                    const data = dimensionData[dim];
                    if (!data) return null;
                    
                    return (
                      <View key={dim} className="mb-6">
                        <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-4">
                          <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-semibold text-gray-900">{dim} Distribution</Text>
                            <View className="flex-row bg-gray-100 rounded p-0.5">
                              <TouchableOpacity onPress={() => setChartType('BAR')} className={`px-2 py-1 rounded ${chartType === 'BAR' ? 'bg-white shadow-sm' : ''}`}>
                                <Ionicons name="bar-chart" size={14} color={chartType === 'BAR' ? '#3B82F6' : '#6B7280'} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => setChartType('PIE')} className={`px-2 py-1 rounded ${chartType === 'PIE' ? 'bg-white shadow-sm' : ''}`}>
                                <Ionicons name="pie-chart" size={14} color={chartType === 'PIE' ? '#3B82F6' : '#6B7280'} />
                              </TouchableOpacity>
                            </View>
                          </View>
                          
                          {chartType === 'BAR' ? (
                            <BarChart 
                              data={data.data.slice(0, 8).map(d => ({ label: d.name, value: d.clicks }))}
                              height={220}
                              rotateLabels={data.data.length > 4}
                            />
                          ) : (
                            <PieChart 
                              data={data.data.slice(0, 6).map(d => ({ label: d.name, value: d.clicks }))}
                            />
                          )}
                        </View>

                        <View className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <Text className="font-semibold text-gray-700 text-xs uppercase">{dim} Detailed Stats</Text>
                          </View>
                          {data.data.map((item, idx) => (
                            <View key={idx} className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-0">
                              <Text className="w-8 text-gray-400 text-xs font-medium">#{idx + 1}</Text>
                              <Text className="flex-1 text-sm text-gray-900">{item.name}</Text>
                              <View className="items-end">
                                <Text className="text-sm font-bold text-gray-900">{item.clicks}</Text>
                                <Text className="text-[10px] text-gray-500">{item.percentage.toFixed(1)}%</Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
