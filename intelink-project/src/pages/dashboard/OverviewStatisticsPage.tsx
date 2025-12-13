import { OverviewStatistics } from "../../components/dashboard/OverviewStatistics";

export const OverviewStatisticsPage = () => {
	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-900">📉 Overview Statistics</h1>
				<p className="text-gray-600 mt-1">
					View comprehensive statistics across all your short URLs
				</p>
			</div>
			<OverviewStatistics />
		</div>
	);
};
