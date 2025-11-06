import { DashboardOverviewPage } from "./DashboardOverviewPage.tsx";
import { ShortUrlPage } from "./ShortUrlPage.tsx";
import { StatisticsContent } from "../../components/dashboard/StatisticsContent.tsx";
import { OverviewStatisticsPage } from "./OverviewStatisticsPage.tsx";
import { ApisPage } from "./ApisPage.tsx";
import { DomainsPage } from "./DomainsPage.tsx";
import { SettingsPage } from "./SettingsPage.tsx";
import SubscriptionsPage from "../SubscriptionsPage.tsx";

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
		path: "overview-stats",
		component: <OverviewStatisticsPage />
	},
	{
		path: "statistics",
		component: <StatisticsContent />
	},
	{
		path: "apis",
		component: <ApisPage />
	},
	{
		path: "domains",
		component: <DomainsPage />
	},
	{
		path: "settings",
		component: <SettingsPage />
	},
	{
		path: "subscriptions",
		component: <SubscriptionsPage />
	}
];
