"use client"


import { useState, useEffect, useCallback } from "react"
import type { StatisticsResponse, DimensionType } from "../types/statistics"
import axios from "axios"

export const useStatistics = (shortcode: string, dimensionType: DimensionType) => {
  const [data, setData] = useState<StatisticsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    if (!shortcode || !dimensionType) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/statistics/${shortcode}/dimension`, {
        params: { type: dimensionType },
      })
      setData(response.data)
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
  }, [shortcode, dimensionType])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return { data, loading, error, refetch: fetchStatistics }
}
