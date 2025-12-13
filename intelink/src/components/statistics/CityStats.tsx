import { useEffect, useState } from 'react';
import { useStatistics } from '../../hooks/useStatistics';
import { type GeographyStatResponse } from '../../dto/StatisticsDTO';

interface Props {
    shortCode: string;
}

export default function CityStats({ shortCode }: Props) {
    const { getCityStats } = useStatistics();
    const [data, setData] = useState<GeographyStatResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!data) return <div>No data</div>;

    return (
        <div className="p-4 bg-white rounded shadow overflow-auto max-h-[600px]">
            <h3 className="text-lg font-bold mb-2">City Statistics</h3>
            <pre className="text-xs font-mono bg-gray-50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
