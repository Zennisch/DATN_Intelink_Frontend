"use client"

import type React from "react"
import { type DimensionType, DIMENSION_CATEGORIES } from "../types/statistics"

interface DimensionSelectorProps {
  selectedDimensions: DimensionType[]
  onDimensionChange: (dimensions: DimensionType[]) => void
  isAllSelected: boolean
  onAllToggle: () => void
}

export const DimensionSelector: React.FC<DimensionSelectorProps> = ({ selectedDimensions, onDimensionChange, isAllSelected, onAllToggle }) => {
  // Lấy tất cả dimension

  const handleDimensionClick = (dimension: DimensionType) => {
    if (selectedDimensions.includes(dimension)) {
      onDimensionChange(selectedDimensions.filter((d) => d !== dimension))
    } else {
      onDimensionChange([...selectedDimensions, dimension])
    }

  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Select Dimension</h3>
      <button
        onClick={onAllToggle}
        className={`w-full mb-4 px-3 py-2 text-sm rounded-md font-bold transition-colors ${
          isAllSelected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      {!isAllSelected && (
        <div className="flex flex-col gap-4">
          {Object.entries(DIMENSION_CATEGORIES).map(([category, dimensions]) => (
            <div key={category} className="mb-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {dimensions.map((dimension) => (
                  <button
                    key={dimension}
                    onClick={() => handleDimensionClick(dimension)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedDimensions.includes(dimension)
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
      )}
    </div>
  )
}
