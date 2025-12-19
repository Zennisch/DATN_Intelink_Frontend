import { OverviewStatistics } from "../../components/statistics/OverviewStatistics";

export default function DashboardStatisticsPage() {
	return (
		<div className="p-4 md:p-6">
			<div className="mb-6">
				<h1 className="text-xl md:text-2xl font-bold text-gray-900">📉 Overview Statistics</h1>
				<p className="text-sm md:text-base text-gray-600 mt-1">
					View comprehensive statistics across all your short URLs
				</p>
			</div>
			<OverviewStatistics />
		</div>
	);
};
