"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { 
  StatisticsService, 
  type StatisticsData
} from "../../services/StatisticsService"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export type DimensionType = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY"


interface TimeStatisticsProps {
  shortcode: string
  validShortcodes?: string[] // Optional prop for valid shortcodes
}

export const TimeStatistics: React.FC<TimeStatisticsProps> = ({ shortcode, validShortcodes = [] }) => {
  const [granularity, setGranularity] = useState<DimensionType>("HOURLY")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [data, setData] = useState<StatisticsData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"regular" | "peak">("regular")

  const formatDate = (date: Date | undefined): string | undefined => {
    if (!date) return undefined
    // Đặt giờ về 00:00:00 UTC
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
    return d.toISOString()
  }

  // Validate date range and shortcode
  const validateInputs = (
    start: Date | undefined,
    end: Date | undefined,
    granularity: DimensionType,
    shortcode: string,
  ): string | null => {
    console.log("Validating inputs:", { start, end, granularity, shortcode })
    if (!shortcode || shortcode.trim() === "") {
      return "Invalid or missing shortcode."
    }
    if (validShortcodes.length > 0 && !validShortcodes.includes(shortcode)) {
      return `The shortcode "${shortcode}" is not valid. Please select a valid shortcode from the URL list.`
    }

    return null
  }

  const fetchTimeStats = async () => {
    setLoading(true)
    setError(null)

    const validationError = validateInputs(startDate, endDate, granularity, shortcode)
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const result = await StatisticsService.getTimeSeriesStatistics(
        shortcode,
        granularity.toLowerCase(),
        startDate?.toISOString(),
        endDate?.toISOString()
      )

      if (!result.buckets) {
         result.buckets = []
      }

      const totalClicks = result.totalClicks || result.buckets.reduce((sum, item) => sum + item.clicks, 0)
      const transformedData: StatisticsData[] = result.buckets.map((item) => {
        const date = new Date(item.time)
        let formattedName = ""

        switch (granularity) {
          case "YEARLY":
            formattedName = date.getFullYear().toString()
            break
          case "MONTHLY":
            formattedName = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
            break
          case "DAILY":
            formattedName = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
            break
          case "HOURLY":
            formattedName = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:00`
            break
          default:
            formattedName = item.time
        }

        return {
          name: formattedName,
          clicks: item.clicks,
          percentage: totalClicks ? (item.clicks / totalClicks) * 100 : 0,
        }
      })

      setData(transformedData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchTopPeakTimes = async () => {
    setLoading(true)
    setError(null)

    const validationError = validateInputs(startDate, endDate, granularity, shortcode)
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const result = await StatisticsService.getTopPeakTimes(shortcode, granularity.toLowerCase())

      if (!result.topPeakTimes) {
         result.topPeakTimes = []
      }

      const totalClicks = result.total || result.topPeakTimes.reduce((sum, item) => sum + item.clicks, 0)
      const transformedData: StatisticsData[] = result.topPeakTimes.map((item) => {
        const date = new Date(item.time)
        let formattedName = ""

        switch (granularity) {
          case "YEARLY":
            formattedName = date.getFullYear().toString()
            break
          case "MONTHLY":
            formattedName = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
            break
          case "DAILY":
            formattedName = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
            break
          case "HOURLY":
            formattedName = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:00`
            break
          default:
            formattedName = item.time
        }

        return {
          name: formattedName,
          clicks: item.clicks,
          percentage: totalClicks ? (item.clicks / totalClicks) * 100 : 0,
        }
      })

      setData(transformedData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === "peak") {
      fetchTopPeakTimes()
    } else {
      fetchTimeStats()
    }
  }, [shortcode, granularity, startDate, endDate, viewMode])

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Clicks",
        data: data.map((item) => item.clicks),
        backgroundColor: "#4F7CFF",
        borderColor: "#3B5BDB",
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: viewMode === "peak" ? `Top Peak Times (${granularity})` : `Click Statistics (${granularity})`,
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const item = data[context.dataIndex]
            return `${context.label}: ${item.clicks} (${item.percentage.toFixed(1)}%)`
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: granularity.charAt(0).toUpperCase() + granularity.slice(1).toLowerCase() },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Clicks" },
        grid: { display: true },
      },
    },
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800">Error loading time statistics: {error}</span>
            {error && (
              <div className="mt-2 text-sm text-gray-700">
                <div>
                  <strong>Shortcode:</strong> {shortcode}
                </div>
                <div>
                  <strong>Start Date:</strong> {formatDate(startDate)}
                </div>
                <div>
                  <strong>End Date:</strong> {formatDate(endDate)}
                </div>
                <div>
                  <strong>Granularity:</strong> {granularity}
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            {error.includes("shortcode") || error.includes("date range") || error.includes("Invalid response")
              ? error
              : "Please try a different date range, granularity, or shortcode."}
            <br />
            If the problem persists, contact the system administrator.
          </div>
          <button
            onClick={viewMode === "peak" ? fetchTopPeakTimes : fetchTimeStats}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Time-based Analytics</h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("regular")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "regular" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Regular Stats
            </button>
            <button
              onClick={() => setViewMode("peak")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "peak" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Top Peak Times
            </button>
          </div>
        </div>

        {viewMode === "regular" && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date || undefined)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholderText="Select start date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date || undefined)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholderText="Select end date"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Granularity</label>
              <select
                value={granularity}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGranularity(e.target.value as DimensionType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="HOURLY">Hourly</option>
                <option value="DAILY">Daily</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
          </div>
        )}

        {viewMode === "peak" && (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
				<div className="flex-2 flex items-end">
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                  <strong>Top Peak Times:</strong> Hiển thị 10 khoảng thời gian có lượt click cao nhất
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Granularity</label>
                <select
                  value={granularity}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setGranularity(e.target.value as DimensionType)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
              
            </div>
          </div>
        )}

        {data.length > 0 ? (
          <div style={{ height: "400px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {viewMode === "peak"
              ? "No peak times data available for the selected granularity"
              : "No time-based data available for the selected period"}
          </div>
        )}
      </div>
    </div>
  )
}
