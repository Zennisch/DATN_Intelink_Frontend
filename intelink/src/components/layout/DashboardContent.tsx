import APIsPage from "../../pages/dashboard/APIsPage";
import type { Page } from "../../pages/DashboardPage";
import LinksPage from "../../pages/dashboard/LinksPage";
import StatisticsPage from "../../pages/dashboard/StatisticsPage";
import OverviewPage from "../../pages/dashboard/OverviewPage";

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
			default:
				return <OverviewPage />;
		}
	};

	return <div className="flex-1 bg-white">{renderPage()}</div>;
};
