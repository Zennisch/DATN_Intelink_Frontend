"use client"

import type React from "react"
import { useState } from "react"
import { StatisticsDashboard } from "../components/StatisticsDashboard"

function StatisticsPage() {
  const [shortcode, setShortcode] = useState<string>("")
  const [currentShortcode, setCurrentShortcode] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (shortcode.trim()) {
      setCurrentShortcode(shortcode.trim())
    }
  }

  return (
    <div className="App">
      {!currentShortcode ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Statistics Dashboard</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="shortcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Shortcode
                </label>
                <input
                  type="text"
                  id="shortcode"
                  value={shortcode}
                  onChange={(e) => setShortcode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter shortcode..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                View Statistics
              </button>
            </form>
          </div>
        </div>
      ) : (
        <StatisticsDashboard shortcode={currentShortcode} />
      )}
    </div>
  )
}

export default  StatisticsPage;
