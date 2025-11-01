import { useCallback, useState } from 'react';
import { TimeStatisticsService, type TimeSeriesResponse, type TopPeakTimesResponse, type TimeGranularity } from '../services/ShortUrlService';

export const useTimeStatistics = (shortcode: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeData, setTimeData] = useState<TimeSeriesResponse | null>(null);
  const [peakData, setPeakData] = useState<TopPeakTimesResponse | null>(null);

  const fetchTime = useCallback(async (granularity: TimeGranularity, customFrom?: string, customTo?: string) => {
    if (!shortcode) return;
    setLoading(true); setError(null);
    try {
      const data = await TimeStatisticsService.getTimeSeries(shortcode, { granularity, customFrom, customTo });
      setTimeData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch time statistics');
      setTimeData(null);
    } finally { setLoading(false); }
  }, [shortcode]);

  const fetchPeak = useCallback(async (granularity: TimeGranularity) => {
    if (!shortcode) return;
    setLoading(true); setError(null);
    try {
      const data = await TimeStatisticsService.getTopPeakTimes(shortcode, granularity);
      setPeakData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch peak times');
      setPeakData(null);
    } finally { setLoading(false); }
  }, [shortcode]);

  return { loading, error, timeData, peakData, fetchTime, fetchPeak };
};
