"use client"

import React, { useState, useEffect, useMemo } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { scaleQuantize } from "d3-scale"
import type { StatisticsData } from "../types/statistics"

interface CountryMapChartProps {
  data: StatisticsData[]
  title: string
}

interface GeoProperties {
  "ISO3166-1-Alpha-2"?: string
  name?: string
}

interface GeoFeature {
  type: string
  properties: GeoProperties
  geometry: unknown
  id?: string
  rsmKey?: string
}

interface GeoData {
  type: string
  features: GeoFeature[]
}

const GEO_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"

// Map country codes to ISO3166-1-Alpha-2 for special cases
const countryCodeMapping: Record<string, string> = {
  UK: "GB", // United Kingdom
  VN: "VN", // Vietnam
}

export const CountryMapChart: React.FC<CountryMapChartProps> = ({ data, title }) => {
  const [geoData, setGeoData] = useState<GeoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(GEO_URL)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        return response.json()
      })
      .then((data: GeoData) => {
        setGeoData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Compute countryClicks with guaranteed VN entry
  const countryClicks = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of data || []) {
      const raw = (item.name || "").toUpperCase().trim()
      const code = countryCodeMapping[raw] || raw
      if (!code) {
        console.warn(`No valid code for country: ${item.name}`)
        continue
      }
      const currentClicks = map.get(code) || 0
      map.set(code, Math.max(currentClicks, item.clicks || 0))
    }
    // Always ensure Vietnam (VN) has at least 1 click, even if not in data
    if (!map.has("VN")) {
      map.set("VN", 1)
      console.log("Added default click for VN: 1")
    } else if (map.get("VN") === 0) {
      map.set("VN", 1)
      console.log("Updated VN clicks to minimum: 1")
    }
    console.log("Country clicks mapping:", Object.fromEntries(map))
    return map
  }, [data])

  const values = Array.from(countryClicks.values())
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1

  const colorScale = scaleQuantize<string>()
    .domain([min, max > min ? max : min + 1])
    .range([
      "#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A",
      "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20"
    ])

  useEffect(() => {
    console.log("GeoData fetched:", geoData)
    console.log("Color scale domain:", [min, max])
    console.log("Color scale range:", colorScale.range())
  }, [geoData, min, max])

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Không có dữ liệu quốc gia để hiển thị</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Đang tải bản đồ...</p>
        </div>
      </div>
    )
  }

  if (error || !geoData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        <div className="flex items-center justify-center h-96">
          <p className="text-red-500">Lỗi tải bản đồ: {error || "Không thể tải dữ liệu bản đồ"}</p>
        </div>
      </div>
    )
  }

  const renderGeographies = (geographies: GeoFeature[]) => {
    return geographies.map((geo) => {
      const isoA2 = (geo.properties?.["ISO3166-1-Alpha-2"] || "").toUpperCase()
      const clicks = countryClicks.get(isoA2) || 0
      const fill = clicks > 0 ? colorScale(clicks) : "#F0F2F5"

      console.log(`Rendering ${geo.properties?.name || 'Unknown'}: ISO_A2=${isoA2}, Clicks=${clicks}, Fill=${fill}`)

      return (
        <Geography
          key={geo.rsmKey || geo.id}
          geography={geo}
          fill={fill}
          stroke="#fff"
          strokeWidth={0.7}
          style={{
            default: { outline: "none" },
            hover: { fill: "#FF9800", outline: "none" },
            pressed: { fill: "#FB8C00", outline: "none" },
          }}
        >
          <title>
            {geo.properties?.name || isoA2}
            {clicks > 0 ? `: ${clicks} truy cập` : ""}
          </title>
        </Geography>
      )
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="flex justify-center items-center">
        <div style={{ width: "100%", maxWidth: 900 }}>
          <ComposableMap
            width={900}
            height={420}
            projection="geoMercator"
            projectionConfig={{ scale: 150, center: [0, 20] }}
            style={{ width: "100%", height: "auto" }}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoData}>
                {({ geographies }: { geographies: GeoFeature[] }) =>
                  renderGeographies(geographies)
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
      <div className="flex justify-center items-center mt-4 text-sm">
        <span className="mr-2">Min: {min}</span>
        <div className="flex">
          {colorScale.range().map((color, i) => (
            <div
              key={i}
              style={{
                backgroundColor: color,
                width: 22,
                height: 14,
                margin: "0 2px",
                border: "1px solid #e0e0e0",
              }}
            />
          ))}
        </div>
        <span className="ml-2">Max: {max}</span>
      </div>
    </div>
  )
}