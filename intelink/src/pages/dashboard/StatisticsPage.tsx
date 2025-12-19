import { useState } from 'react';
import { UrlListSidebar } from '../../components/statistics/UrlListSidebar';
import { StatisticsTabs, type StatisticsTab } from '../../components/statistics/StatisticsTabs';
import { TimeStatistics } from '../../components/statistics/TimeStatistics';
import { DimensionStatistics } from '../../components/statistics/DimensionStatistics';
import CountryStats from '../../components/statistics/CountryStats';
import type { ShortUrlResponse } from '../../dto/ShortUrlDTO';

export default function StatisticsPage() {
    const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<StatisticsTab>("time");

    const handleUrlSelect = (shortCode: string, _urlData: ShortUrlResponse) => {
        setSelectedUrl(shortCode);
        // Reset to time tab when selecting a new URL
        setActiveTab("time");
    };

    const renderTabContent = () => {
        if (!selectedUrl) return null;

        switch (activeTab) {
            case "time":
                return <TimeStatistics shortcode={selectedUrl} />;
            case "location":
                return <CountryStats shortCode={selectedUrl} />;
            case "dimension":
                return <DimensionStatistics shortcode={selectedUrl} />;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex bg-gray-50 overflow-hidden relative">
            {/* Left Sidebar - URL List (Desktop only) */}
            <UrlListSidebar
                selectedUrl={selectedUrl}
                onUrlSelect={handleUrlSelect}
                className="hidden md:flex z-30 h-full"
                variant="sidebar"
            />

            {/* Right Content - Statistics */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Mobile Horizontal URL List */}
                <UrlListSidebar
                    selectedUrl={selectedUrl}
                    onUrlSelect={handleUrlSelect}
                    className="md:hidden z-30 w-full pl-16"
                    variant="horizontal"
                />

                {/* Header with Tabs */}
                <StatisticsTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    selectedUrl={selectedUrl}
                />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                    {selectedUrl ? (
                        renderTabContent()
                    ) : (
                        <div className="p-4 md:p-6">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                                <div className="text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                                        Welcome to Analytics Dashboard
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
                                        Select a URL from the list above to view detailed analytics including 
                                        time series data and dimension breakdowns.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
