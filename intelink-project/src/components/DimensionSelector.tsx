"use client"

import type React from "react"
import { type DimensionType, DIMENSION_CATEGORIES } from "../types/statistics"

interface DimensionSelectorProps {
  selectedDimension: DimensionType
  onDimensionChange: (dimension: DimensionType) => void
}

export const DimensionSelector: React.FC<DimensionSelectorProps> = ({ selectedDimension, onDimensionChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Select Dimension</h3>

      {Object.entries(DIMENSION_CATEGORIES).map(([category, dimensions]) => (
        <div key={category} className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
          <div className="grid grid-cols-2 gap-2">
            {dimensions.map((dimension) => (
              <button
                key={dimension}
                onClick={() => onDimensionChange(dimension)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedDimension === dimension
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {dimension.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
