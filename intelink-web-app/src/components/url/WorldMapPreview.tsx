import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { getCountryByCode } from "../../utils/countries";

interface WorldMapPreviewProps {
	mode: "allow" | "block";
	selectedCountries: string[];
	height?: number;
}

// Use CDN for map data to avoid bundle size increase
// Using raw Natural Earth GeoJSON with complete properties including ISO codes
const geoUrl =
	"https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

export const WorldMapPreview = ({
	mode,
	selectedCountries,
	height = 350,
}: WorldMapPreviewProps) => {
	const [tooltipContent, setTooltipContent] = useState("");
	const [zoom, setZoom] = useState(1);
	const [center, setCenter] = useState<[number, number]>([0, 20]);

	const getCountryColor = (geoId: string) => {
		const isSelected = selectedCountries.includes(geoId);
		const isAllowMode = mode === "allow";

		if (!isSelected) {
			return "#D1D5DB"; // Medium gray - more visible than light gray
		}

		return isAllowMode ? "#10B981" : "#EF4444"; // Green (allow) / Red (block)
	};

	const getCountryOpacity = (geoId: string) => {
		const isSelected = selectedCountries.includes(geoId);
		return isSelected ? 0.95 : 0.75; // Increased opacity for better visibility
	};

	const handleMouseEnter = (geoId: string) => {
		const country = getCountryByCode(geoId);
		const isSelected = selectedCountries.includes(geoId);

		if (country) {
			const status = isSelected
				? mode === "allow"
					? "✅ Allowed"
					: "🚫 Blocked"
				: mode === "allow"
					? "⚪ Not Allowed"
					: "⚪ Not Blocked";

			setTooltipContent(`${country.flag} ${country.name} - ${status}`);
		} else {
			setTooltipContent(`Country: ${geoId}`);
		}
	};

	const handleMouseLeave = () => {
		setTooltipContent("");
	};

	const hasSelections = selectedCountries.length > 0;

	return (
		<div className="relative w-full">
			{/* Map Container with aspect ratio */}
			<div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
				<div style={{ height: `${height}px`, width: "100%" }}>
					<ComposableMap
						projection="geoMercator"
						projectionConfig={{
							scale: 120,
							center: [0, 20],
						}}
						style={{
							width: "100%",
							height: "100%",
						}}
					>
						<ZoomableGroup
							zoom={zoom}
							minZoom={1}
							maxZoom={8}
							center={center}
							onMoveEnd={(position) => {
								setZoom(position.zoom);
								setCenter(position.coordinates);
							}}
						>
							<Geographies geography={geoUrl}>
						{({ geographies }: { geographies: any[] }) =>
							geographies.map((geo: any) => {
								// Extract ISO code from properties - Natural Earth GeoJSON provides ISO_A2
								const isoCode = (
									geo.properties?.ISO_A2 ||
									geo.properties?.iso_a2 ||
									geo.properties?.ISO ||
									geo.id
								)
									?.toString()
									.toUpperCase();

								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={getCountryColor(isoCode)}
										fillOpacity={getCountryOpacity(isoCode)}
										stroke="#FFFFFF"
										strokeWidth={0.5}
										style={{
											default: { outline: "none" },
											hover: {
												fill: getCountryColor(isoCode),
												fillOpacity: 1,
												stroke: "#374151",
												strokeWidth: 1,
												outline: "none",
												cursor: "pointer",
											},
											pressed: {
												fill: getCountryColor(isoCode),
												fillOpacity: 0.8,
												outline: "none",
											},
										}}
										data-tooltip-id="world-map-tooltip"
										onMouseEnter={() => handleMouseEnter(isoCode)}
										onMouseLeave={handleMouseLeave}
									/>
								);
							})
						}
					</Geographies>
						</ZoomableGroup>
				</ComposableMap>
				</div>
			</div>
			{/* Tooltip */}
			<Tooltip
				id="world-map-tooltip"
				content={tooltipContent}
				place="top"
				style={{
					backgroundColor: "#1F2937",
					color: "#F9FAFB",
					borderRadius: "0.5rem",
					padding: "0.5rem 0.75rem",
					fontSize: "0.875rem",
					fontWeight: "500",
					zIndex: 1000,
				}}
			/>

			{/* Zoom Controls */}
			<div className="absolute top-4 right-4 flex flex-col gap-2">
				<button
					type="button"
					onClick={() => setZoom(Math.min(zoom * 1.5, 8))}
					className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
					title="Zoom In"
				>
					<i className="fas fa-plus text-gray-700 text-sm"></i>
				</button>
				<button
					type="button"
					onClick={() => setZoom(Math.max(zoom / 1.5, 1))}
					className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
					title="Zoom Out"
				>
					<i className="fas fa-minus text-gray-700 text-sm"></i>
				</button>
				<button
					type="button"
					onClick={() => {
						setZoom(1);
						setCenter([0, 20]);
					}}
					className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
					title="Reset View"
				>
					<i className="fas fa-expand text-gray-700 text-xs"></i>
				</button>
			</div>

			{/* Enhanced Legend */}
			<div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md p-3">
				<div className="flex items-center gap-3 text-xs">
					<div className="flex items-center gap-2">
						<div
							className={`w-5 h-4 rounded ${mode === "allow" ? "bg-green-500" : "bg-red-500"} shadow-sm`}
						></div>
						<span className="text-gray-900 font-semibold">
							{mode === "allow" ? "Allowed" : "Blocked"}
						</span>
					</div>
					<div className="w-px h-4 bg-gray-300"></div>
					<div className="flex items-center gap-2">
						<div className="w-5 h-4 rounded bg-gray-400 shadow-sm"></div>
						<span className="text-gray-600 font-medium">
							{mode === "allow" ? "Restricted" : "Accessible"}
						</span>
					</div>
				</div>
			</div>{" "}
			{/* No Selection Message */}
			{!hasSelections && (
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 shadow-lg">
						<p className="text-sm text-gray-600 flex items-center gap-2">
							<i className="fas fa-info-circle text-gray-400"></i>
							Select countries to see them highlighted on the map
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
