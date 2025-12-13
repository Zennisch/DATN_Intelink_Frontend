import { useState, useEffect, useCallback } from "react"
import { StatisticsService, type StatisticsResponse } from "../services/StatisticsService"
import type { DimensionType } from "../types/statistics"

export const useStatistics = (shortCode: string, dimensionTypes: DimensionType | DimensionType[]) => {
  const [data, setData] = useState<Record<string, StatisticsResponse>>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    if (!shortCode) return

    setLoading(true)
    setError(null)

    try {
      const dimensions = Array.isArray(dimensionTypes) ? dimensionTypes : [dimensionTypes]
      const results: Record<string, StatisticsResponse> = {}

      await Promise.all(dimensions.map(async (dim) => {
          try {
            const result = await StatisticsService.getDimensionStatistics(shortCode, dim)
            
            // Ensure data property exists
            if (!result.data) {
                result.data = []
            }

            results[dim] = result
          } catch (e) {
              console.error(`Failed to fetch statistics for dimension ${dim}`, e)
              results[dim] = { data: [], totalClicks: 0, category: dim as string }
          }
      }))

      setData(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [shortCode, JSON.stringify(dimensionTypes)])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return { data, loading, error, refetch: fetchStatistics }
}
