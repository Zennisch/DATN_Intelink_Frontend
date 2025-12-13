import APIsPage from "../../pages/dashboard/APIsPage";
import type { Page } from "../../pages/DashboardPage";
import StatisticsPage from "../../pages/dashboard/StatisticsPage";
import OverviewPage from "../../pages/dashboard/OverviewPage";
import LinksPage from "../../pages/dashboard/LinksPage";
import SubscriptionHistoryPage from "../../pages/dashboard/SubscriptionHistoryPage";

interface DashboardContentProps {
	currentPage: Page;
}

export const DashboardMain = ({ currentPage }: DashboardContentProps) => {
	const renderPage = () => {
		switch (currentPage) {
			case "overview":
				return <OverviewPage />;
			case "links":
				return <LinksPage />;
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

	return <div className="flex-1 bg-white">{renderPage()}</div>;
};
