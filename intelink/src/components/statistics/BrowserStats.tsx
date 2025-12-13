import { useEffect, useState } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { type DimensionStatResponse } from '../../dto/StatisticsDTO';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
    shortCode: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export default function BrowserStats({ shortCode }: Props) {
    const { getBrowserStats } = useStatistics();
    const [data, setData] = useState<DimensionStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getBrowserStats(shortCode);
                setData(result);
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shortCode]);

    if (loading && !data) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (!data || !data.data || data.data.length === 0) return <div className="p-4 text-slate-500">No data available</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Browser Statistics</h3>
                        <p className="text-sm text-slate-500">Traffic sources by browser.</p>
                    </div>
                    
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setChartType('pie')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                chartType === 'pie' 
                                    ? "bg-white text-indigo-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <i className="fas fa-chart-pie mr-2"></i> Pie
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                chartType === 'bar' 
                                    ? "bg-white text-indigo-600 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <i className="fas fa-chart-bar mr-2"></i> Bar
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="h-[300px] w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={data.data as any}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="clicks"
                                >
                                    {data.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        ) : (
                            <BarChart
                                data={data.data as any}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="clicks" fill="#4f46e5" name="Clicks" radius={[4, 4, 0, 0]}>
                                    {data.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {data.data.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                            {item.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{item.clicks}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{item.percentage.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
