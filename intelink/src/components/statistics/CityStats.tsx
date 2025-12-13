import { useEffect, useState, useMemo } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { type GeographyStatResponse } from '../../dto/StatisticsDTO';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface Props {
    shortCode: string;
}

export default function CityStats({ shortCode }: Props) {
    const { getCityStats } = useStatistics();
    const [data, setData] = useState<GeographyStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'allowed' | 'blocked'>('allowed');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getCityStats(shortCode);
                setData(result);
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shortCode]);

    const sortedData = useMemo(() => {
        if (!data?.data) return [];
        // Filter out 0 values for the active tab and sort desc
        return [...data.data]
            .filter(item => (activeTab === 'allowed' ? item.allowedClicks : item.blockedClicks) > 0)
            .sort((a, b) => {
                const valA = activeTab === 'allowed' ? a.allowedClicks : a.blockedClicks;
                const valB = activeTab === 'allowed' ? b.allowedClicks : b.blockedClicks;
                return valB - valA;
            });
    }, [data, activeTab]);

    if (loading && !data) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!data) return <div className="p-4 text-slate-500">No data available</div>;

    // Calculate height based on number of items to allow scrolling
    const chartHeight = Math.max(500, sortedData.length * 50);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
             <div className="p-6 border-b border-slate-100 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">City Statistics</h3>
                        <p className="text-sm text-slate-500">Traffic sources by city.</p>
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
                            Allowed
                        </button>
                        <button
                            onClick={() => setActiveTab('blocked')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                activeTab === 'blocked' 
                                    ? "bg-white text-red-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            Blocked
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                 {sortedData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <i className="fas fa-city text-4xl mb-3"></i>
                        <p>No {activeTab} traffic data available for cities</p>
                    </div>
                ) : (
                    <div style={{ height: chartHeight, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={sortedData}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={150}
                                    tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar 
                                    dataKey={activeTab === 'allowed' ? 'allowedClicks' : 'blockedClicks'} 
                                    name="Clicks"
                                    radius={[0, 4, 4, 0]} 
                                    barSize={24}
                                >
                                    {sortedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={activeTab === 'allowed' ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
