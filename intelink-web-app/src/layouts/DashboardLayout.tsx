import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { OverviewPage, LinksPage, StatisticsPage, APIsPage, DomainsPage } from "../pages/dashboard";

interface DashboardLayoutProps {}

type Page = "overview" | "links" | "statistics" | "apis" | "domains";

export const DashboardLayout = ({}: DashboardLayoutProps) => {
	const [currentPage, setCurrentPage] = useState<Page>("overview");

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

	return (
		<div className="flex flex-row min-h-screen">
			<DashboardSidebar setCurrentPage={setCurrentPage} />
			<div className="flex-1 bg-white">{renderPage()}</div>
		</div>
	);
};
