"use client"

import { useState, useEffect, useCallback } from "react"
import type { StatisticsResponse, DimensionType } from "../types/statistics"
import axios from "axios"

export const useStatistics = (shortcode: string, dimensionTypes: DimensionType[]) => {
  const [data, setData] = useState<Record<DimensionType, StatisticsResponse> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    if (!shortcode || dimensionTypes.length === 0) return

    setLoading(true)
    setError(null)

    try {
      // Fetch data for all selected dimensions in parallel
      const promises = dimensionTypes.map(async (dimensionType) => {
        const response = await axios.get(`/statistics/${shortcode}/dimension`, {
          params: { type: dimensionType },
        })
        return { dimensionType, data: response.data }
      })

      const results = await Promise.all(promises)
      const dataMap: Record<DimensionType, StatisticsResponse> = {} as Record<DimensionType, StatisticsResponse>

      results.forEach(({ dimensionType, data }) => {
        dataMap[dimensionType] = data
      })

      setData(dataMap)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "An error occurred")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred")
      }
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [shortcode, JSON.stringify(dimensionTypes)])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return { data, loading, error, refetch: fetchStatistics }
}
