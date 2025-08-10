"use client"

import type React from "react"
import { useState } from "react"
import { DimensionType } from "../types/statistics"
import { useStatistics } from "../hooks/useStatistics"
import { StatisticsChart } from "./StatisticsChart"
import { DimensionSelector } from "./DimensionSelector"
import { StatisticsTable } from "./StatisticsTable"

interface StatisticsDashboardProps {
  shortcode: string
}

export const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ shortcode }) => {
  const [selectedDimension, setSelectedDimension] = useState<DimensionType>(DimensionType.BROWSER)
  const [chartType, setChartType] = useState<"bar" | "doughnut">("bar")

  const { data, loading, error, refetch } = useStatistics(shortcode, selectedDimension)

  const handleDimensionChange = (dimension: DimensionType) => {
    setSelectedDimension(dimension)
  }

  const getDimensionTitle = (dimension: DimensionType) => {
    return dimension
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading statistics</p>
            <p>{error}</p>
            <button
              onClick={refetch}
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Statistics Dashboard</h1>
          <p className="text-gray-600 mt-2">Shortcode: {shortcode}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Dimension Selector */}
          <div className="lg:col-span-1">
            <DimensionSelector selectedDimension={selectedDimension} onDimensionChange={handleDimensionChange} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {data && Array.isArray(data.data) && data.data.length > 0 ? (
              <>
                {/* Chart Controls */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{getDimensionTitle(selectedDimension)} Statistics</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setChartType("bar")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Bar Chart
                      </button>
                      <button
                        onClick={() => setChartType("doughnut")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          chartType === "doughnut"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Doughnut Chart
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {typeof data.totalClicks === "number" ? data.totalClicks.toLocaleString() : 0} records
                  </p>
                </div>

                {/* Chart */}
                <StatisticsChart data={data.data} title={getDimensionTitle(selectedDimension)} chartType={chartType} />

                {/* Table */}
                <StatisticsTable data={data.data} title={getDimensionTitle(selectedDimension)} />
              </>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500">No data available for the selected dimension.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
