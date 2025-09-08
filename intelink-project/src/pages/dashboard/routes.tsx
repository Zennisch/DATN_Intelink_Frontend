import { DashboardOverviewPage } from "./DashboardOverviewPage";
import { ShortUrlPage } from "./ShortUrlPage";
import { StatisticsContent } from "../../components/dashboard/StatisticsContent";

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
