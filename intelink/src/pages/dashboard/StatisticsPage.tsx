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

type TabType = 'timeseries' | 'peaktime' | 'browser' | 'os' | 'device' | 'country' | 'city';

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
                size: 9, // Grid 3x3 looks better with 9 items
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
        setActiveTab('timeseries');
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

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'timeseries', label: 'Overview', icon: 'fa-chart-line' },
        { id: 'peaktime', label: 'Peak Time', icon: 'fa-clock' },
        { id: 'country', label: 'Geo Location', icon: 'fa-globe-americas' },
        { id: 'city', label: 'Cities', icon: 'fa-city' },
        { id: 'device', label: 'Devices', icon: 'fa-mobile-alt' },
        { id: 'browser', label: 'Browsers', icon: 'fa-window-maximize' },
        { id: 'os', label: 'OS', icon: 'fa-laptop-code' },
    ];

    // --- Detail View (Dashboard) ---
    if (selectedShortUrl) {
        return (
            <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-1/2 h-64 bg-gradient-to-bl from-indigo-50 to-transparent pointer-events-none" />

                {/* Top Navigation Bar */}
                <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 z-10 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleBack}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            <i className="fas fa-arrow-left text-lg"></i>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <i className="fas fa-chart-pie text-indigo-500"></i>
                                {selectedShortUrl.title || 'Untitled Analytics'}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                                    {selectedShortUrl.shortUrl}
                                </span>
                                <i className="fas fa-arrow-right text-xs text-slate-300"></i>
                                <span className="truncate max-w-[200px] sm:max-w-[400px]" title={selectedShortUrl.originalUrl}>
                                    {selectedShortUrl.originalUrl}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    {/* Tabs Navigation */}
                    <div className="flex-shrink-0 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                        <div className="inline-flex bg-slate-200/50 p-1 rounded-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                                        ${activeTab === tab.id 
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                                        }
                                    `}
                                >
                                    <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-indigo-500' : 'text-slate-400'}`}></i>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Chart Area */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
                        {/* Header of the Chart Card */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <h3 className="font-semibold text-slate-800">
                                {tabs.find(t => t.id === activeTab)?.label} Analysis
                            </h3>
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                <i className="fas fa-download"></i>
                            </button>
                        </div>

                        {/* Chart Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                            <Suspense fallback={
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <i className="fas fa-circle-notch fa-spin text-3xl mb-3 text-indigo-400"></i>
                                    <p className="text-sm font-medium">Crunching data...</p>
                                </div>
                            }>
                                {renderTabContent()}
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- List View (Selection Screen) ---
    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans">
            <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-indigo-100/40 to-slate-50 pointer-events-none" />

            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 sm:p-8 z-0 overflow-hidden">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                        <p className="text-slate-500 mt-2">Visualize insights and performance metrics for your links.</p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="w-full sm:w-72 relative">
                        <Input
                            placeholder="Search links..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            fullWidth
                            className="bg-white border-slate-200 focus:border-indigo-500 shadow-sm"
                            startAdornment={<i className="fas fa-search text-slate-400" />}
                            endAdornment={
                                <button 
                                    onClick={handleSearch}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-1.5 rounded-md transition-colors"
                                >
                                    <i className="fas fa-arrow-right text-sm"></i>
                                </button>
                            }
                        />
                    </div>
                </div>

                {/* Grid Content */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-10 scrollbar-thin scrollbar-thumb-slate-200">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <i className="fas fa-spinner fa-spin text-3xl mb-4 text-indigo-500"></i>
                            <p>Loading your links...</p>
                        </div>
                    ) : urls.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-chart-bar text-3xl text-slate-300"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">No links found</h3>
                            <p className="text-slate-500 text-sm">Create links to see statistics here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {urls.map((url) => (
                                <div
                                    key={url.id}
                                    onClick={() => setSelectedShortUrl(url)}
                                    className="group bg-white rounded-xl p-5 border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <i className="fas fa-chart-area text-lg"></i>
                                        </div>
                                        <div className="text-slate-300 group-hover:text-indigo-400 transition-colors">
                                            <i className="fas fa-external-link-alt"></i>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative z-10">
                                        <h3 className="font-bold text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                            {url.title || 'Untitled Link'}
                                        </h3>
                                        <p className="text-sm text-indigo-600 font-medium truncate mb-2 opacity-80">
                                            {url.shortUrl}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate border-t border-slate-100 pt-3 mt-1 flex items-center gap-2">
                                            <i className="fas fa-calendar-alt text-slate-400"></i>
                                            {new Date(url.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    
                                    {/* Optional: Add Click count here if available in DTO later */}
                                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                                        <i className="fas fa-mouse-pointer"></i> 1,234 clicks
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                className="bg-white border-slate-300"
                            >
                                <i className="fas fa-chevron-left mr-1"></i> Prev
                            </Button>
                            <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded border border-slate-200">
                                {page + 1} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                className="bg-white border-slate-300"
                            >
                                Next <i className="fas fa-chevron-right ml-1"></i>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}