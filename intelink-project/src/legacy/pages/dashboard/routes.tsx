import { DashboardOverviewPage } from "./DashboardOverviewPage.tsx";
import { ShortUrlPage } from "./ShortUrlPage.tsx";
import { StatisticsContent } from "../../components/dashboard/StatisticsContent.tsx";

export const dashboardRoutes = [
	{
		path: "",
		component: <DashboardOverviewPage />
	},
	{
		path: "overview", 
		component: <DashboardOverviewPage />
	},
	{
		path: "short-urls",
		component: <ShortUrlPage />
	},
	{
		path: "statistics",
		component: <StatisticsContent />
	}
];
