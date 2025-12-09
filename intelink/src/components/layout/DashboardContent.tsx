import APIsPage from "../../pages/APIsPage";
import type { Page } from "../../pages/DashboardPage";
import LinksPage from "../../pages/LinksPage";
import OverviewPage from "../../pages/OverviewPage";
import StatisticsPage from "../../pages/StatisticsPage";

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
			// case "domains":
			// 	return <DomainsPage />;
			default:
				return <OverviewPage />;
		}
	};

	return <div className="flex-1 bg-white">{renderPage()}</div>;
};
