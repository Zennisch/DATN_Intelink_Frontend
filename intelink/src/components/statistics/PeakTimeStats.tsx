import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { type PeakTimeStatResponse } from '../../dto/StatisticsDTO';
import { useStatistics } from '../../hooks/useStatistics';
import type { Granularity } from '../../services/StatisticsService';
import { Button, Input, Select } from '../primary';

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

export default function PeakTimeStats({ shortCode }: Props) {
    const { getPeakTimeStats } = useStatistics();
    const [data, setData] = useState<PeakTimeStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [granularity, setGranularity] = useState<Granularity>('HOURLY');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getPeakTimeStats(shortCode, {
                granularity,
                from: fromDate || undefined,
                to: toDate || undefined,
                timezone: 'Z',
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
    }, [shortCode]);

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

    // Custom colors for the bars (Top 1 gets a special color)
    const getBarColor = (index: number) => {
        if (index === 0) return '#4f46e5'; // Indigo-600 for #1
        if (index === 1) return '#6366f1'; // Indigo-500
        if (index === 2) return '#818cf8'; // Indigo-400
        return '#a5b4fc'; // Indigo-300 for the rest
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-[650px] flex flex-col">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Peak Traffic Times</h3>
                        <p className="text-sm text-slate-500">Top time periods with the highest engagement.</p>
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
                    <i className="fas fa-clock text-4xl mb-3"></i>
                    <p>No peak time data available for this period</p>
                </div>
            ) : (
                <div className="flex-1 w-full min-h-0 overflow-x-auto">
                    <div style={{ minWidth: '100%', width: Math.max(1000, data.data.length * 50), height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data.data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis 
                                    dataKey="bucketStart" 
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis 
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    labelFormatter={formatDate}
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number | string | Array<number | string>) => [`${value} clicks`, 'Traffic']}
                                />
                                <Bar dataKey="clicks" radius={[4, 4, 0, 0]} barSize={32}>
                                    {data.data.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
