import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';
import { useStatistics } from "../../hooks/useStatistics";
import { DimensionType as DT, type TimeGranularity, type DimensionTypeT, type StatisticsResponse } from "../../services/ShortUrlService";
import { useTimeStatistics } from "../../hooks/useTimeStatistics";
import { useShortUrl } from "../../hooks/useShortUrl";
import { BarChart } from "../../components/ui/BarChart";
import { PieChart } from "../../components/ui/PieChart";
import { CountryMap } from "../../components/ui/CountryMap";
import { LineChart } from "../../components/ui/LineChart";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function StatisticsScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{ shortcode?: string }>();
  const initialShortcode = params?.shortcode || '';

  const { shortUrls, fetchShortUrls } = useShortUrl();
  const [selectedShort, setSelectedShort] = useState<string>(initialShortcode);
  const [granularity, setGranularity] = useState<TimeGranularity>('DAILY');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedBarInfo, setSelectedBarInfo] = useState<string | null>(null);

  // kept for reference parity with web; use dimsToFetch below instead
  // Dimension selection state and computed fetch list
  const DIMENSION_CATEGORIES: Record<string, DimensionTypeT[]> = useMemo(() => ({
    Traffic: [DT.REFERRER, DT.REFERRER_TYPE, DT.UTM_SOURCE, DT.UTM_MEDIUM, DT.UTM_CAMPAIGN, DT.UTM_TERM, DT.UTM_CONTENT] as DimensionTypeT[],
    Geo: [DT.COUNTRY, DT.REGION, DT.CITY, DT.TIMEZONE] as DimensionTypeT[],
    Tech: [DT.BROWSER, DT.OS, DT.DEVICE_TYPE, DT.ISP, DT.LANGUAGE] as DimensionTypeT[],
  }), []);
  const allDimensions: DimensionTypeT[] = useMemo(() => Object.values(DIMENSION_CATEGORIES).flat(), [DIMENSION_CATEGORIES]);

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedDims, setSelectedDims] = useState<DimensionTypeT[]>([DT.BROWSER as DimensionTypeT]);
  const dimsToFetch = isAllSelected ? allDimensions : selectedDims;

  type Mode = 'TIME' | 'COUNTRY' | 'DIMENSION';
  type ChartType = 'BAR' | 'PIE';
  const [mode, setMode] = useState<Mode>('TIME');
  const [timeMode, setTimeMode] = useState<'REGULAR' | 'PEAK'>('REGULAR');
  const [chartType, setChartType] = useState<ChartType>('BAR');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Optimize fetching: in Country mode, only fetch COUNTRY data
  const fetchDims: DimensionTypeT[] = useMemo(
    () => (mode === 'COUNTRY' ? [DT.COUNTRY as DimensionTypeT] : dimsToFetch),
    [mode, dimsToFetch]
  );
  const { data, /*loading,*/ error, refetch } = useStatistics(selectedShort, fetchDims);
  const { timeData, loading: timeLoading, error: timeError, fetchTime, peakData, fetchPeak } = useTimeStatistics(selectedShort);

  useEffect(() => {
    // When navigating to this screen with a different shortcode, update selection
    if (typeof params?.shortcode === 'string' && params.shortcode && params.shortcode !== selectedShort) {
      setSelectedShort(params.shortcode);
    }
  }, [params?.shortcode, selectedShort]);

  useEffect(() => {
    // Load first page of URLs for selection
    fetchShortUrls({ page: 0, size: 20, sortBy: 'createdAt', sortDirection: 'desc' }).then((res) => {
      if (!initialShortcode && res?.content?.length) {
        setSelectedShort(res.content[0].shortCode);
      }
    }).catch(() => {});
  }, [fetchShortUrls, initialShortcode]);

  useEffect(() => {
    if (selectedShort) {
      if (mode === 'TIME') {
        if (timeMode === 'REGULAR') {
          const fromIso = startDate ? toUtcStartOfDay(startDate) : undefined;
          const toIso = endDate ? toUtcStartOfDay(endDate) : undefined;
          fetchTime(granularity, fromIso, toIso);
        }
        else fetchPeak(granularity);
      }
      if (mode !== 'TIME') refetch();
    }
    setSelectedBarInfo(null);
  }, [selectedShort, granularity, fetchTime, refetch, fetchPeak, mode, timeMode, startDate, endDate]);

  const toUtcStartOfDay = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    return d.toISOString();
  };

  const formatDateLabel = (date?: Date) => {
    if (!date) return 'Select date';
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const applyPresetDays = (days: number) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (days - 1));
    setStartDate(start);
    setEndDate(today);
  };
  const applyThisMonth = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(start);
    setEndDate(today);
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-1" style={{ color }}>
            {value}
          </Text>
          <Text className="text-gray-600 text-sm">{title}</Text>
        </View>
        <View className="p-3 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
      </View>
    </View>
  );

  const StatList = ({ title, items }: { title: string; items: { name: string; clicks: number; percentage: number }[] }) => (
    <View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>
      {items.length === 0 ? (
        <Text className="text-gray-500">No data</Text>
      ) : (
        items
          .slice()
          .sort((a, b) => b.clicks - a.clicks)
          .map((it, idx) => (
          <View key={idx} className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <Text className="text-gray-800 flex-1" numberOfLines={1}>{it.name}</Text>
            <Text className="text-gray-600 w-16 text-right">{it.clicks}</Text>
            <Text className="text-gray-500 w-16 text-right">{(it.percentage ?? 0).toFixed(1)}%</Text>
          </View>
        ))
      )}
    </View>
  );

  // Generate line chart data with fake allows and blocks data
  const lineChartData = useMemo(() => {
    if (!timeData?.buckets) return [];
    const fmt = (iso: string) => {
      const date = new Date(iso);
      switch (granularity) {
        case 'YEARLY':
          return String(date.getFullYear());
        case 'MONTHLY':
          return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        case 'DAILY':
          return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        case 'HOURLY':
        default:
          return `${date.getHours().toString().padStart(2, '0')}:00`;
      }
    };
    
    return timeData.buckets.map(b => {
      const clicks = b.clicks;
      // Generate random allows and blocks based on clicks
      const allows = Math.floor(clicks * (0.7 + Math.random() * 0.2)); // 70-90% of clicks
      const blocks = clicks - allows + Math.floor(Math.random() * 10); // remaining + some random
      
      return {
        time: fmt(b.time),
        clicks,
        allows,
        blocks
      };
    });
  }, [timeData, granularity]);

  const GranularityButton = ({ g, label }: { g: TimeGranularity; label: string }) => (
    <TouchableOpacity onPress={() => setGranularity(g)} className={`px-3 py-1 rounded-full ${granularity === g ? 'bg-blue-600' : 'bg-gray-100'}`}>
      <Text className={`${granularity === g ? 'text-white' : 'text-gray-700'} text-xs`}>{label}</Text>
    </TouchableOpacity>
  );

  const ModeTab = ({ id, label }: { id: Mode; label: string }) => (
    <TouchableOpacity onPress={() => setMode(id)} className={`px-4 py-2 rounded-lg ${mode === id ? 'bg-blue-600' : 'bg-gray-100'}`}>
      <Text className={`${mode === id ? 'text-white' : 'text-gray-700'} text-sm`}>{label}</Text>
    </TouchableOpacity>
  );

  const ChartToggle = () => (
    <View className="flex-row space-x-2">
      <TouchableOpacity onPress={() => setChartType('BAR')} className={`px-3 py-1 rounded ${chartType === 'BAR' ? 'bg-blue-600' : 'bg-gray-100'}`}>
        <Text className={`${chartType === 'BAR' ? 'text-white' : 'text-gray-700'} text-xs`}>Bar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setChartType('PIE')} className={`px-3 py-1 rounded ${chartType === 'PIE' ? 'bg-blue-600' : 'bg-gray-100'}`}>
        <Text className={`${chartType === 'PIE' ? 'text-white' : 'text-gray-700'} text-xs`}>Pie</Text>
      </TouchableOpacity>
    </View>
  );

  const DimensionPill = ({ d }: { d: DimensionTypeT }) => {
    const active = selectedDims.includes(d) || (isAllSelected && allDimensions.includes(d));
    const toggle = () => {
      if (isAllSelected) {
        // Turning off All switches to individual mode with this single selection
        setIsAllSelected(false);
        setSelectedDims([d]);
        return;
      }
      setSelectedDims(prev => active ? prev.filter(x => x !== d) : [...prev, d]);
    };
    return (
      <TouchableOpacity onPress={toggle} className={`px-3 py-1 rounded-full mr-2 mb-2 ${active ? 'bg-blue-100 border border-blue-300' : 'bg-gray-100'}`}>
        <Text className={`${active ? 'text-blue-700' : 'text-gray-700'} text-xs`}>{d.replace(/_/g, ' ')}</Text>
      </TouchableOpacity>
    );
  };

  const AllToggle = () => (
    <TouchableOpacity
      onPress={() => {
        if (isAllSelected) {
          setIsAllSelected(false);
          setSelectedDims([DT.BROWSER as DimensionTypeT]);
        } else {
          setIsAllSelected(true);
          setSelectedDims([]);
        }
      }}
      className={`px-3 py-1 rounded-full mr-2 mb-2 ${isAllSelected ? 'bg-blue-600' : 'bg-gray-100'}`}
    >
      <Text className={`${isAllSelected ? 'text-white' : 'text-gray-700'} text-xs`}>All Dimensions ({allDimensions.length})</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* No top header - tabs control navigation */}
      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
      >
        {/* URL Selector */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-900 mb-2">Select URL</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            <View className="flex-row">
              {shortUrls.map((u) => (
                <TouchableOpacity key={u.shortCode} onPress={() => setSelectedShort(u.shortCode)} className={`mx-1 px-3 py-2 rounded-lg border ${selectedShort === u.shortCode ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}`}>
                  <Text className={`text-xs ${selectedShort === u.shortUrl ? 'text-blue-700' : 'text-gray-700'}`} numberOfLines={1}>{u.shortUrl}</Text>
                  <Text className="text-[10px] text-gray-500" numberOfLines={1}>{u.totalClicks} clicks</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Stats Overview */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Overview
          </Text>
          <View className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total URLs"
              value={user?.totalShortUrls || 0}
              icon="link"
              color="#3B82F6"
            />
            <StatCard
              title="Total Clicks"
              value={user?.totalClicks || 0}
              icon="trending-up"
              color="#10B981"
            />
            <StatCard
              title="This Month"
              value="0"
              icon="calendar"
              color="#F59E0B"
            />
            <StatCard
              title="Today"
              value="0"
              icon="today"
              color="#EF4444"
            />
          </View>
        </View>

        {/* Mode Tabs */}
        <View className="flex-row space-x-2 mb-4">
          <ModeTab id="TIME" label="Time" />
          <ModeTab id="COUNTRY" label="Country" />
          <ModeTab id="DIMENSION" label="Dimension" />
        </View>

        {mode === 'TIME' && (
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-gray-900">Over Time</Text>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity onPress={() => setTimeMode('REGULAR')} className={`px-3 py-1 rounded ${timeMode === 'REGULAR' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                  <Text className={`${timeMode === 'REGULAR' ? 'text-white' : 'text-gray-700'} text-xs`}>Regular</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTimeMode('PEAK')} className={`px-3 py-1 rounded ${timeMode === 'PEAK' ? 'bg-blue-600' : 'bg-gray-100'}`}>
                  <Text className={`${timeMode === 'PEAK' ? 'text-white' : 'text-gray-700'} text-xs`}>Top Peaks</Text>
                </TouchableOpacity>
                <GranularityButton g="HOURLY" label="H" />
                <GranularityButton g="DAILY" label="D" />
                <GranularityButton g="MONTHLY" label="M" />
                <GranularityButton g="YEARLY" label="Y" />
              </View>
            </View>
            {/* Date range controls for Regular mode */}
            {timeMode === 'REGULAR' && (
              <View className="flex-row items-center mb-3">
                <TouchableOpacity onPress={() => setShowStartPicker(true)} className="flex-1 mr-2 px-3 py-2 rounded border border-gray-300 bg-gray-50">
                  <Text className="text-gray-700 text-xs">Start Date</Text>
                  <Text className="text-gray-900">{formatDateLabel(startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} className="flex-1 ml-2 px-3 py-2 rounded border border-gray-300 bg-gray-50">
                  <Text className="text-gray-700 text-xs">End Date</Text>
                  <Text className="text-gray-900">{formatDateLabel(endDate)}</Text>
                </TouchableOpacity>
              </View>
            )}
            {timeMode === 'REGULAR' && (
              <View className="flex-row items-center space-x-2 mb-3">
                <TouchableOpacity onPress={() => applyPresetDays(7)} className="px-2 py-1 rounded bg-gray-100">
                  <Text className="text-gray-700 text-xs">Last 7d</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyPresetDays(30)} className="px-2 py-1 rounded bg-gray-100">
                  <Text className="text-gray-700 text-xs">Last 30d</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={applyThisMonth} className="px-2 py-1 rounded bg-gray-100">
                  <Text className="text-gray-700 text-xs">This month</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setStartDate(undefined); setEndDate(undefined); }} className="px-2 py-1 rounded bg-gray-100">
                  <Text className="text-gray-700 text-xs">Clear</Text>
                </TouchableOpacity>
              </View>
            )}
            {(timeError || error) && (
              <View className="p-3 bg-red-50 border border-red-200 rounded mb-2">
                <Text className="text-red-700 text-sm">{timeError || error}</Text>
                <View className="flex-row mt-2">
                  <TouchableOpacity
                    className="px-3 py-1 rounded bg-red-100"
                    onPress={() => {
                      if (timeMode === 'PEAK') fetchPeak(granularity);
                      else {
                        const fromIso = startDate ? toUtcStartOfDay(startDate) : undefined;
                        const toIso = endDate ? toUtcStartOfDay(endDate) : undefined;
                        fetchTime(granularity, fromIso, toIso);
                      }
                    }}
                  >
                    <Text className="text-red-700 text-xs">Try again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {timeMode === 'REGULAR' ? (
              (timeLoading && !timeData) ? (
                <Text className="text-center text-gray-500">Loading chart...</Text>
              ) : (
                <LineChart
                  data={lineChartData}
                  height={280}
                  rotateLabels={lineChartData.length > 6}
                />
              )
            ) : (
              (timeLoading && !peakData) ? (
                <Text className="text-center text-gray-500">Loading top peaks...</Text>
              ) : (
                <BarChart
                  data={(peakData?.topPeakTimes || []).slice(0, 10).map(p => ({ label: new Date(p.time).toLocaleString(), value: p.clicks }))}
                  height={260}
                  rotateLabels={true}
                  onBarPress={(d) => setSelectedBarInfo(`${d.label}: ${d.value} clicks`)}
                />
              )
            )}
            {selectedBarInfo && (
              <View className="mt-2 p-2 rounded bg-blue-50 border border-blue-200">
                <Text className="text-blue-800 text-xs">{selectedBarInfo}</Text>
              </View>
            )}
            {/* Native pickers - rendered at bottom to avoid layout shift */}
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    // if endDate exists and is before new startDate, adjust endDate
                    if (endDate && date > endDate) setEndDate(date);
                    setStartDate(date);
                  }
                }}
                maximumDate={endDate || new Date()}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={endDate || startDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
                minimumDate={startDate}
                maximumDate={new Date()}
              />
            )}
          </View>
        )}

        {/* Country and Dimension sections */}
        {mode !== 'TIME' && (
          <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-900">{mode === 'COUNTRY' ? 'Country' : 'Dimensions'} statistics</Text>
              <ChartToggle />
            </View>
            {mode === 'COUNTRY' ? (
              <>
                {/* Country map placeholder: We can integrate a map library later; for now, chart + list */}
                {(() => {
                  const countries = (data?.[DT.COUNTRY]?.data || []).slice().sort((a, b) => b.clicks - a.clicks);
                  const totalVisits = countries.reduce((sum, c) => sum + c.clicks, 0);
                  const topCountry = countries[0]?.name || 'N/A';
                  const topShare = countries[0]?.percentage?.toFixed?.(1) || '0';
                  return (
                    <>
                      {error && (
                        <View className="p-3 bg-red-50 border border-red-200 rounded mb-2">
                          <Text className="text-red-700 text-sm">{error}</Text>
                          <View className="flex-row mt-2">
                            <TouchableOpacity className="px-3 py-1 rounded bg-red-100" onPress={() => refetch()}>
                              <Text className="text-red-700 text-xs">Try again</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                      {/* Country map to mirror web */}
                      <CountryMap data={countries} title="Visitors by Country" />
                      <View className="mt-4" />
                      {chartType === 'BAR' ? (
                        <BarChart data={countries.map(i => ({ label: i.name, value: i.clicks }))} height={240} rotateLabels={countries.length > 6} />
                      ) : (
                        <PieChart data={countries.map(i => ({ label: i.name, value: i.clicks }))} />
                      )}
                      {/* Summary cards */}
                      <View className="grid grid-cols-2 gap-3 mt-4">
                        <StatCard title="Countries" value={countries.length} icon="flag" color="#3B82F6" />
                        <StatCard title="Total Visits" value={totalVisits} icon="footsteps" color="#10B981" />
                        <StatCard title="Top Country" value={topCountry} icon="earth" color="#8B5CF6" />
                        <StatCard title="Top Share" value={`${topShare}%`} icon="trending-up" color="#F59E0B" />
                      </View>
                      {/* Top 10 list */}
                      <View className="mt-4 bg-white rounded-lg p-6 border border-gray-200">
                        <Text className="text-lg font-semibold text-gray-900 mb-2">Top Countries</Text>
                        {countries.slice(0, 10).map((c, idx) => (
                          <View key={`${c.name}-${idx}`} className="flex-row items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <View className="flex-row items-center">
                              <Text className="text-gray-600 mr-3">#{idx + 1}</Text>
                              <Text className="text-gray-900">{c.name}</Text>
                            </View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-900 mr-2">{c.clicks}</Text>
                              <Text className="text-gray-500">({c.percentage.toFixed(1)}%)</Text>
                            </View>
                          </View>
                        ))}
                        {countries.length === 0 && (
                          <Text className="text-center text-gray-500">No country data available</Text>
                        )}
                      </View>
                    </>
                  );
                })()}
              </>
            ) : (
              <>
                {/* Collapsible filter panel */}
                <TouchableOpacity
                  onPress={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  className="flex-row items-center justify-between px-3 py-2 rounded border border-gray-200 bg-gray-50 mb-3"
                >
                  <Text className="text-gray-900 font-medium">Statistics Filters</Text>
                  <Ionicons name={isFilterPanelOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
                </TouchableOpacity>
                {isFilterPanelOpen && (
                  <View className="mb-3">
                    <AllToggle />
                    <Text className="text-gray-500 text-xs mb-2">{isAllSelected ? `All (${allDimensions.length})` : `${selectedDims.length} selected`}</Text>
                    {Object.entries(DIMENSION_CATEGORIES).map(([cat, dims]) => (
                      <View key={cat} className="mb-2">
                        <Text className="text-gray-700 text-xs mb-1">{cat}</Text>
                        <View className="flex-row flex-wrap">
                          {dims.map((d) => (
                            <DimensionPill key={d} d={d} />
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
                {error && (
                  <View className="p-3 bg-red-50 border border-red-200 rounded mb-2">
                    <Text className="text-red-700 text-sm">{error}</Text>
                    <View className="flex-row mt-2">
                      <TouchableOpacity className="px-3 py-1 rounded bg-red-100" onPress={() => refetch()}>
                        <Text className="text-red-700 text-xs">Try again</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {/* One chart per selected dimension */}
                <View className="space-y-4">
                  {(isAllSelected ? allDimensions : selectedDims).map((d: DimensionTypeT) => {
                    const items = ((data?.[d] as StatisticsResponse | undefined)?.data) || [];
                    if (items.length === 0) return null;
                    return (
                      <View key={`chart-${d}`} className="bg-white rounded-lg p-4 border border-gray-200">
                        <Text className="text-base font-semibold text-gray-900 mb-2">{d.replace(/_/g, ' ')}</Text>
                        {chartType === 'BAR' ? (
                          <BarChart data={items.slice(0, 10).map(i => ({ label: i.name, value: i.clicks }))} height={240} rotateLabels={items.length > 6} />
                        ) : (
                          <PieChart data={items.slice(0, 10).map(i => ({ label: i.name, value: i.clicks }))} />
                        )}
                      </View>
                    );
                  })}
                </View>
                {/* Lists per selected dimension */}
                <View className="mt-4 space-y-4">
                  {(isAllSelected ? allDimensions : selectedDims).map((d: DimensionTypeT) => (
                    <StatList key={d} title={d.replace(/_/g, ' ')} items={(((data?.[d] as StatisticsResponse | undefined)?.data) || []).slice().sort((a,b)=>b.clicks-a.clicks)} />
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Recent Activity (placeholder) */}
        <View className="bg-white rounded-lg p-6 mt-6 shadow-sm border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </Text>
          <View className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  <View>
                    <Text className="text-gray-900 text-sm">
                      URL {item} clicked
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      2 hours ago
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500 text-sm">+1</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
