import { useState, useEffect, Suspense, lazy } from 'react';
import { useShortUrl } from '../../hooks/useShortUrl';
import { Input, Button } from '../../components/primary';
import type { ShortUrlResponse } from '../../dto/ShortUrlDTO';

// Lazy load statistics components
const BrowserStats = lazy(() => import('../../components/statistics/BrowserStats'));
const OsStats = lazy(() => import('../../components/statistics/OsStats'));
const DeviceStats = lazy(() => import('../../components/statistics/DeviceStats'));
const CountryStats = lazy(() => import('../../components/statistics/CountryStats'));
const CityStats = lazy(() => import('../../components/statistics/CityStats'));
const TimeSeriesStats = lazy(() => import('../../components/statistics/TimeSeriesStats'));
const PeakTimeStats = lazy(() => import('../../components/statistics/PeakTimeStats'));

type TabType = 'browser' | 'os' | 'device' | 'country' | 'city' | 'timeseries' | 'peaktime';

export default function StatisticsPage() {
    const { searchShortUrls, isLoading } = useShortUrl();
    const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedShortUrl, setSelectedShortUrl] = useState<ShortUrlResponse | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('timeseries');

    const fetchUrls = async () => {
        try {
            const response = await searchShortUrls({
                query: searchQuery || undefined,
                page,
                size: 10,
                sortBy: 'createdAt',
                direction: 'desc'
            });
            setUrls(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Failed to fetch URLs:', error);
        }
    };

    useEffect(() => {
        if (!selectedShortUrl) {
            fetchUrls();
        }
    }, [page, selectedShortUrl]);

    const handleSearch = () => {
        setPage(0);
        fetchUrls();
    };

    const handleBack = () => {
        setSelectedShortUrl(null);
        setActiveTab('timeseries'); // Reset tab
    };

    const renderTabContent = () => {
        if (!selectedShortUrl) return null;
        const shortCode = selectedShortUrl.shortCode;

        switch (activeTab) {
            case 'browser': return <BrowserStats shortCode={shortCode} />;
            case 'os': return <OsStats shortCode={shortCode} />;
            case 'device': return <DeviceStats shortCode={shortCode} />;
            case 'country': return <CountryStats shortCode={shortCode} />;
            case 'city': return <CityStats shortCode={shortCode} />;
            case 'timeseries': return <TimeSeriesStats shortCode={shortCode} />;
            case 'peaktime': return <PeakTimeStats shortCode={shortCode} />;
            default: return null;
        }
    };

    if (selectedShortUrl) {
        return (
            <div className="h-full flex flex-col space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                    <Button variant="secondary" onClick={handleBack}>
                        <i className="fas fa-arrow-left mr-2"></i> Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{selectedShortUrl.title || 'Untitled'}</h2>
                        <p className="text-sm text-gray-500">{selectedShortUrl.shortUrl}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-gray-200">
                    {[
                        { id: 'timeseries', label: 'Time Series' },
                        { id: 'peaktime', label: 'Peak Time' },
                        { id: 'browser', label: 'Browser' },
                        { id: 'os', label: 'OS' },
                        { id: 'device', label: 'Device' },
                        { id: 'country', label: 'Country' },
                        { id: 'city', label: 'City' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-white rounded-b-lg shadow-sm border border-gray-200 p-4">
                    <Suspense fallback={<div className="flex justify-center p-8">Loading statistics...</div>}>
                        {renderTabContent()}
                    </Suspense>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Statistics</h1>
                <p className="text-gray-600">Select a link to view detailed statistics</p>
            </div>

            <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search links..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        startAdornment={<i className="fas fa-search text-gray-400" />}
                    />
                </div>
                <Button onClick={handleSearch}>Search</Button>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-lg shadow border border-gray-200">
                {isLoading && urls.length === 0 ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {urls.map((url) => (
                            <div
                                key={url.id}
                                onClick={() => setSelectedShortUrl(url)}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-indigo-600 truncate">
                                        {url.shortUrl}
                                    </h3>
                                    <p className="text-sm text-gray-900 truncate mt-1">
                                        {url.title || url.originalUrl}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(url.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <i className="fas fa-chevron-right text-gray-400"></i>
                                </div>
                            </div>
                        ))}
                        {urls.length === 0 && !isLoading && (
                            <div className="p-8 text-center text-gray-500">
                                No links found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center space-x-2">
                    <Button
                        variant="secondary"
                        disabled={page === 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={page >= totalPages - 1}
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}