import { useEffect, useState } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { type TimeSeriesStatResponse } from '../../dto/StatisticsDTO';
import type { Granularity } from '../../services/StatisticsService';
import { Select, Input, Button } from '../primary';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface Props {
    shortCode: string;
}

const GRANULARITY_OPTIONS = [
    { value: 'HOURLY', label: 'Hourly' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'YEARLY', label: 'Yearly' },
];

export default function TimeSeriesStats({ shortCode }: Props) {
    const { getTimeSeriesStats } = useStatistics();
    const [data, setData] = useState<TimeSeriesStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [granularity, setGranularity] = useState<Granularity>('DAILY');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getTimeSeriesStats(shortCode, {
                granularity,
                from: fromDate || undefined,
                to: toDate || undefined,
                timezone: 'Z'
            });
            setData(result);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [shortCode]); // Only fetch on mount/shortCode change initially. 
    // User must click "Apply" to refresh with new params, or we can add params to dependency array.
    // Let's add params to dependency array for auto-update, but maybe debounce?
    // For now, let's use a manual trigger or just the dependency array. 
    // Given the UI request, a manual "Apply" or auto-update is fine. 
    // Let's stick to the useEffect dependency for simplicity and responsiveness.
    
    useEffect(() => {
        fetchData();
    }, [granularity, fromDate, toDate]);

    if (loading && !data) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    // Format date for X-axis
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-[650px] flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Traffic Over Time</h3>
                        <p className="text-sm text-slate-500">Analyze click trends over specific periods.</p>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                        <Select
                            label="Granularity"
                            options={GRANULARITY_OPTIONS}
                            value={granularity}
                            onChange={(val) => setGranularity(val as Granularity)}
                            fullWidth
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Input
                            type="date"
                            label="From"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            fullWidth
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Input
                            type="date"
                            label="To"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            fullWidth
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Button onClick={fetchData} fullWidth variant="secondary" className="bg-white border-slate-300 hover:bg-slate-50 text-slate-700">
                            <i className="fas fa-sync-alt mr-2"></i> Refresh Data
                        </Button>
                    </div>
                </div>
            </div>
            
            {error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
            ) : !data || !data.data || data.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <i className="fas fa-chart-line text-4xl mb-3"></i>
                    <p>No time series data available for this period</p>
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0 overflow-x-auto">
                    <div style={{ minWidth: '100%', width: Math.max(1000, data.data.length * 50), height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data.data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="bucketStart" 
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    minTickGap={30}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    labelFormatter={(label) => formatDate(label as string)}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                
                                <Line 
                                    type="monotone" 
                                    dataKey="clicks" 
                                    name="Total Clicks" 
                                    stroke="#4f46e5" // Indigo-600
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#4f46e5' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="allowedClicks" 
                                    name="Allowed" 
                                    stroke="#10b981" // Emerald-500
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#10b981' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="blockedClicks" 
                                    name="Blocked" 
                                    stroke="#ef4444" // Red-500
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: '#ef4444' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
