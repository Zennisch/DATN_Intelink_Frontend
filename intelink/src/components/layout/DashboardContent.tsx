import APIsPage from "../../pages/dashboard/APIsPage";
import type { Page } from "../../pages/DashboardPage";
import StatisticsPage from "../../pages/dashboard/StatisticsPage";
import OverviewPage from "../../pages/dashboard/OverviewPage";
import LinksPage from "../../pages/dashboard/LinksPage";
import SubscriptionHistoryPage from "../../pages/dashboard/SubscriptionHistoryPage";
import DashboardStatisticsPage from "../../pages/dashboard/DashboardStatisticsPage";

interface DashboardContentProps {
	currentPage: Page;
	onOpenSidebar?: () => void;
}

export const DashboardMain = ({ currentPage, onOpenSidebar }: DashboardContentProps) => {
	const renderPage = () => {
		switch (currentPage) {
			case "overview":
				return <OverviewPage />;
			case "links":
				return <LinksPage />;
			case "dashboard":
				return <DashboardStatisticsPage />;
			case "statistics":
				return <StatisticsPage />;
			case "apis":
				return <APIsPage />;
			case "subscriptions":
				return <SubscriptionHistoryPage />;
			default:
				return <OverviewPage />;
		}
	};

	return (
		<div className="flex-1 bg-white relative">
			{/* Mobile Sidebar Toggle Button */}
			<button 
				className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md text-gray-600 border border-gray-200 hover:bg-gray-50"
				onClick={onOpenSidebar}
				aria-label="Open sidebar"
			>
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			{renderPage()}
		</div>
	);
};
