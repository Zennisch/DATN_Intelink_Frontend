import { useEffect, useState, useMemo } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { type GeographyStatResponse } from '../../dto/StatisticsDTO';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import { getCountryByCode } from "../../utils/countries";

interface Props {
    shortCode: string;
}

const geoUrl = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

export default function CountryStats({ shortCode }: Props) {
    const { getCountryStats } = useStatistics();
    const [data, setData] = useState<GeographyStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'allowed' | 'blocked'>('allowed');
    const [tooltipContent, setTooltipContent] = useState("");
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState<[number, number]>([0, 20]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getCountryStats(shortCode);
                setData(result);
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shortCode]);

    const statsMap = useMemo(() => {
        if (!data) return new Map();
        const map = new Map();
        data.data.forEach(item => {
            map.set(item.name.toUpperCase(), item);
        });
        return map;
    }, [data]);

    const maxValues = useMemo(() => {
        if (!data) return { allowed: 0, blocked: 0 };
        const allowedMax = Math.max(...data.data.map(d => d.allowedClicks), 0);
        const blockedMax = Math.max(...data.data.map(d => d.blockedClicks), 0);
        return {
            allowed: allowedMax || 1,
            blocked: blockedMax || 1
        };
    }, [data]);

    const getFillColor = (geoId: string) => {
        const stat = statsMap.get(geoId);
        const value = activeTab === 'allowed' ? (stat?.allowedClicks || 0) : (stat?.blockedClicks || 0);
        const max = activeTab === 'allowed' ? maxValues.allowed : maxValues.blocked;
        
        if (value === 0) return "#F3F4F6"; // gray-100

        // Calculate opacity: min 0.4, max 1.0
        const opacity = 0.4 + (value / max) * 0.6;
        
        if (activeTab === 'allowed') {
            return `rgba(16, 185, 129, ${opacity})`; // emerald-500
        } else {
            return `rgba(239, 68, 68, ${opacity})`; // red-500
        }
    };

    const handleMouseEnter = (geoId: string) => {
        const country = getCountryByCode(geoId);
        const stat = statsMap.get(geoId);
        const allowed = stat?.allowedClicks || 0;
        const blocked = stat?.blockedClicks || 0;
        
        const name = country ? `${country.flag} ${country.name}` : geoId;
        
        setTooltipContent(`${name}\nAllowed: ${allowed}\nBlocked: ${blocked}`);
    };

    if (loading && !data) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 p-4">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Geographic Distribution</h3>
                        <p className="text-sm text-slate-500">Traffic sources by country.</p>
                    </div>
                    
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('allowed')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'allowed' 
                                    ? "bg-white text-emerald-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Allowed Traffic
                        </button>
                        <button
                            onClick={() => setActiveTab('blocked')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'blocked' 
                                    ? "bg-white text-red-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Blocked Traffic
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative h-[500px] bg-slate-50">
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
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const isoCode = (
                                        geo.properties?.ISO_A2 ||
                                        geo.properties?.iso_a2 ||
                                        geo.properties?.ISO ||
                                        geo.id
                                    )?.toString().toUpperCase();

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={getFillColor(isoCode)}
                                            stroke="#FFFFFF"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: {
                                                    fill: getFillColor(isoCode),
                                                    stroke: "#94a3b8",
                                                    strokeWidth: 1,
                                                    outline: "none",
                                                    cursor: "pointer",
                                                },
                                                pressed: {
                                                    outline: "none",
                                                },
                                            }}
                                            data-tooltip-id="country-stats-tooltip"
                                            onMouseEnter={() => handleMouseEnter(isoCode)}
                                            onMouseLeave={() => setTooltipContent("")}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                <Tooltip
                    id="country-stats-tooltip"
                    content={tooltipContent}
                    place="top"
                    style={{
                        backgroundColor: "#1e293b",
                        color: "#f8fafc",
                        borderRadius: "0.5rem",
                        padding: "0.5rem 0.75rem",
                        fontSize: "0.875rem",
                        zIndex: 50,
                        whiteSpace: "pre-line"
                    }}
                />

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={() => setZoom(Math.min(zoom * 1.5, 8))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-50 text-gray-600"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                    <button
                        onClick={() => setZoom(Math.max(zoom / 1.5, 1))}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-50 text-gray-600"
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                    <button
                        onClick={() => { setZoom(1); setCenter([0, 20]); }}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow hover:bg-gray-50 text-gray-600"
                    >
                        <i className="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
