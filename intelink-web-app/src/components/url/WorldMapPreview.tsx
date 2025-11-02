import {ComposableMap, Geographies, Geography} from 'react-simple-maps';
import {Tooltip} from 'react-tooltip';
import {useState} from 'react';
import {getCountryByCode} from '../../utils/countries';

interface WorldMapPreviewProps {
	mode: 'allow' | 'block';
	selectedCountries: string[];
	height?: number;
}

// Use CDN for map data to avoid bundle size increase
// Using raw Natural Earth GeoJSON with complete properties including ISO codes
const geoUrl = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

export const WorldMapPreview = ({mode, selectedCountries, height = 400}: WorldMapPreviewProps) => {
	const [tooltipContent, setTooltipContent] = useState('');
	const [isDebugLogged, setIsDebugLogged] = useState(false);

	const getCountryColor = (geoId: string) => {
		const isSelected = selectedCountries.includes(geoId);
		const isAllowMode = mode === 'allow';

		if (!isSelected) {
			return '#E5E7EB'; // Gray - neutral
		}

		return isAllowMode ? '#10B981' : '#EF4444'; // Green (allow) / Red (block)
	};

	const getCountryOpacity = (geoId: string) => {
		const isSelected = selectedCountries.includes(geoId);
		return isSelected ? 0.9 : 0.6;
	};

	const handleMouseEnter = (geoId: string) => {
		const country = getCountryByCode(geoId);
		const isSelected = selectedCountries.includes(geoId);

		if (country) {
			const status = isSelected
				? mode === 'allow'
					? '✅ Allowed'
					: '🚫 Blocked'
				: mode === 'allow'
					? '⚪ Not Allowed'
					: '⚪ Not Blocked';

			setTooltipContent(`${country.flag} ${country.name} - ${status}`);
		} else {
			setTooltipContent(`Country: ${geoId}`);
		}
	};

	const handleMouseLeave = () => {
		setTooltipContent('');
	};

	const hasSelections = selectedCountries.length > 0;

	return (
		<div className="relative">
			{/* Map Container */}
			<div
				className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
				style={{height: `${height}px`}}
			>
				<ComposableMap
					projection="geoMercator"
					projectionConfig={{
						scale: 120,
						center: [0, 20],
					}}
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					<Geographies geography={geoUrl}>
						{({geographies}: {geographies: any[]}) =>
							geographies.map((geo: any, index: number) => {
								// Debug: Log first few geographies to inspect structure
								if (!isDebugLogged && index < 3) {
									console.log(`🗺️ Geography #${index}:`, {
										id: geo.id,
										rsmKey: geo.rsmKey,
										properties: geo.properties,
										allPropertyKeys: Object.keys(geo.properties || {}),
									});
									if (index === 2) {
										console.log('🗺️ Selected countries for matching:', selectedCountries);
										setIsDebugLogged(true);
									}
								}
								
								// Try multiple property paths to find ISO code
								// World Atlas might use different property names
								const isoCode = (
									geo.properties?.ISO_A2 || 
									geo.properties?.iso_a2 ||
									geo.properties?.['Alpha-2'] ||
									geo.properties?.iso ||
									geo.properties?.ISO ||
									geo.properties?.adm0_a3?.substring(0, 2) || // Sometimes 3-letter to 2-letter
									geo.id
								)?.toString().toUpperCase();
								
								// Debug specific countries
								if (geo.properties?.name === 'Algeria' || geo.properties?.name === 'China' || 
								    geo.properties?.NAME === 'Algeria' || geo.properties?.NAME === 'China') {
									console.log(`🗺️ Found ${geo.properties?.name || geo.properties?.NAME}:`, {
										id: geo.id,
										isoCode,
										properties: geo.properties,
										selectedCountries,
										willBeSelected: selectedCountries.includes(isoCode),
									});
								}
								
								return (
									<Geography
										key={geo.rsmKey}
										geography={geo}
										fill={getCountryColor(isoCode)}
										fillOpacity={getCountryOpacity(isoCode)}
										stroke="#FFFFFF"
										strokeWidth={0.5}
										style={{
											default: {outline: 'none'},
											hover: {
												fill: getCountryColor(isoCode),
												fillOpacity: 1,
												stroke: '#374151',
												strokeWidth: 1,
												outline: 'none',
												cursor: 'pointer',
											},
											pressed: {
												fill: getCountryColor(isoCode),
												fillOpacity: 0.8,
												outline: 'none',
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
				</ComposableMap>
			</div>

			{/* Tooltip */}
			<Tooltip
				id="world-map-tooltip"
				content={tooltipContent}
				place="top"
				style={{
					backgroundColor: '#1F2937',
					color: '#F9FAFB',
					borderRadius: '0.5rem',
					padding: '0.5rem 0.75rem',
					fontSize: '0.875rem',
					fontWeight: '500',
					zIndex: 1000,
				}}
			/>

			{/* Legend */}
			<div className="absolute bottom-3 left-3 bg-white border border-gray-200 rounded-lg shadow-sm p-3 text-xs">
				<div className="space-y-1.5">
					<div className="flex items-center gap-2">
						<div className={`w-4 h-3 rounded ${mode === 'allow' ? 'bg-green-500' : 'bg-red-500'}`}></div>
						<span className="text-gray-700 font-medium">
							{mode === 'allow' ? '✅ Allowed' : '🚫 Blocked'}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-3 rounded bg-gray-300"></div>
						<span className="text-gray-600">
							{mode === 'allow' ? 'Not Allowed' : 'Not Blocked'}
						</span>
					</div>
				</div>
			</div>

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
