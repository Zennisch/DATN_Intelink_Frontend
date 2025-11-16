import type { Page } from "./DashboardLayout";
import {
	OverviewPage,
	LinksPage,
	StatisticsPage,
	APIsPage,
	DomainsPage,
} from "../pages/dashboard";

interface DashboardMainProps {
	currentPage: Page;
}

export const DashboardMain = ({ currentPage }: DashboardMainProps) => {
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
			case "domains":
				return <DomainsPage />;
			default:
				return <OverviewPage />;
		}
	};

	return <div className="flex-1 bg-white">{renderPage()}</div>;
};
