import { useState, useEffect, useCallback } from 'react';
import { StatisticsService, type DimensionTypeT, type StatisticsResponse } from '../services/ShortUrlService';

export const useStatistics = (shortcode: string, dimensionTypes: DimensionTypeT[]) => {
  const [data, setData] = useState<Record<DimensionTypeT, StatisticsResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!shortcode || dimensionTypes.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const promises = dimensionTypes.map(async (dimensionType) => {
        const resp = await StatisticsService.getByDimension(shortcode, dimensionType);
        return { dimensionType, data: resp };
      });

      const results = await Promise.all(promises);
      const map: Record<DimensionTypeT, StatisticsResponse> = {} as any;
      results.forEach(({ dimensionType, data }) => {
        map[dimensionType] = data;
      });
      setData(map);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [shortcode, dimensionTypes]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return { data, loading, error, refetch: fetchStatistics };
};
