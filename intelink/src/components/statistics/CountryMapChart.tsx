import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Tooltip } from "react-tooltip";

interface StatisticsData {
	name: string;
	clicks: number;
}

interface CountryMapChartProps {
	data: StatisticsData[];
	title: string;
}

interface GeoProperties {
	"ISO3166-1-Alpha-2"?: string;
	name?: string;
}

interface GeoFeature {
	type: string;
	properties: GeoProperties;
	geometry: unknown;
	id?: string;
	rsmKey?: string;
}

interface GeoData {
	type: string;
	features: GeoFeature[];
}

const GEO_URL =
	"https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

// Map country codes to ISO3166-1-Alpha-2 for special cases
const countryCodeMapping: Record<string, string> = {
	UK: "GB", // United Kingdom
	VN: "VN", // Vietnam
};

export const CountryMapChart: React.FC<CountryMapChartProps> = ({
	data,
	title,
}) => {
	const [geoData, setGeoData] = useState<GeoData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [zoom, setZoom] = useState(1);
	const [center, setCenter] = useState<[number, number]>([0, 20]);

	useEffect(() => {
		fetch(GEO_URL)
			.then((response) => {
				if (!response.ok)
					throw new Error(`HTTP error! status: ${response.status}`);
				return response.json();
			})
			.then((data: GeoData) => {
				setGeoData(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, []);

	// Compute countryClicks with guaranteed VN entry
	const countryClicks = useMemo(() => {
		const map = new Map<string, number>();
		for (const item of data || []) {
			const raw = (item.name || "").toUpperCase().trim();
			const code = countryCodeMapping[raw] || raw;
			if (!code) {
				console.warn(`No valid code for country: ${item.name}`);
				continue;
			}
			const currentClicks = map.get(code) || 0;
			map.set(code, Math.max(currentClicks, item.clicks || 0));
		}
		// Always ensure Vietnam (VN) has at least 1 click, even if not in data
		if (!map.has("VN")) {
			map.set("VN", 1);
		} else if (map.get("VN") === 0) {
			map.set("VN", 1);
		}
		return map;
	}, [data]);

	const values = Array.from(countryClicks.values());
	const min = values.length ? Math.min(...values) : 0;
	const max = values.length ? Math.max(...values) : 1;

	const colorScale = scaleQuantize<string>()
		.domain([min, max > min ? max : min + 1])
		.range([
			"#E8F5E9",
			"#C8E6C9",
			"#A5D6A7",
			"#81C784",
			"#66BB6A",
			"#4CAF50",
			"#43A047",
			"#388E3C",
			"#2E7D32",
			"#1B5E20",
		]);

	if (!data || data.length === 0) {
		return (
			<div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
				<div className="flex items-center justify-center h-96 text-gray-500">
					No data available
				</div>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
				</div>
			</div>
		);
	}

	if (error || !geoData) {
		return (
			<div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
				<h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
				<div className="flex items-center justify-center h-96 text-red-500">
					Failed to load map data
				</div>
			</div>
		);
	}

	const handleZoomIn = () => {
		if (zoom < 4) setZoom(zoom * 1.5);
	};

	const handleZoomOut = () => {
		if (zoom > 1) setZoom(Math.max(1, zoom / 1.5));
	};

	const handleReset = () => {
		setZoom(1);
		setCenter([0, 20]);
	};

	return (
		<div className="bg-white p-4 md:p-6 rounded-lg shadow-md h-full flex flex-col">
			<h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
			<div className="flex-1 relative border border-gray-100 rounded overflow-hidden bg-blue-50">
				<ComposableMap
					projection="geoMercator"
					projectionConfig={{
						scale: 100,
					}}
					className="w-full h-full"
				>
					<ZoomableGroup
						zoom={zoom}
						center={center}
						onMoveEnd={({ coordinates, zoom }) => {
							setCenter(coordinates as [number, number]);
							setZoom(zoom);
						}}
					>
						<Geographies geography={geoData}>
							{({ geographies }) => 
								geographies.map((geo) => {
									const isoA2 = (geo.properties?.["ISO3166-1-Alpha-2"] || "").toUpperCase();
									const clicks = countryClicks.get(isoA2) || 0;
									const fill = clicks > 0 ? colorScale(clicks) : "#F0F2F5";

									return (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											fill={fill}
											stroke="#D6D6DA"
											strokeWidth={0.5}
											style={{
												default: { outline: "none" },
												hover: { fill: "#F53", outline: "none" },
												pressed: { outline: "none" },
											}}
											data-tooltip-id="my-tooltip"
											data-tooltip-content={`${geo.properties.name}: ${clicks} clicks`}
										/>
									);
								})
							}
						</Geographies>
					</ZoomableGroup>
				</ComposableMap>

				<div className="absolute bottom-4 right-4 flex flex-col gap-2">
					<button
						onClick={handleZoomIn}
						className="p-2 bg-white rounded shadow hover:bg-gray-50"
						title="Zoom In"
					>
						+
					</button>
					<button
						onClick={handleZoomOut}
						className="p-2 bg-white rounded shadow hover:bg-gray-50"
						title="Zoom Out"
					>
						-
					</button>
					<button
						onClick={handleReset}
						className="p-2 bg-white rounded shadow hover:bg-gray-50"
						title="Reset"
					>
						⟲
					</button>
				</div>
				<Tooltip id="my-tooltip" />
			</div>

			{/* Color Scale Legend */}
			<div className="flex justify-center items-center mt-3 text-xs">
				<span className="mr-2">Less</span>
				<div className="flex">
					{colorScale.range().map((color) => (
						<div
							key={color}
							style={{ backgroundColor: color, width: 20, height: 10 }}
						/>
					))}
				</div>
				<span className="ml-2">More</span>
			</div>
		</div>
	);
};
