import React from "react";

interface TimeStatisticsProps {
	shortcode: string;
}

export const TimeStatistics: React.FC<TimeStatisticsProps> = ({
	shortcode,
}) => {
	return (
		<div className="p-6">
			<div className="bg-white rounded-lg border border-gray-200 p-8">
				<div className="text-center">
					<svg
						className="mx-auto h-16 w-16 text-gray-400 mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Time Analytics Coming Soon
					</h3>
					<p className="text-gray-600 mb-4">
						We're working on building comprehensive time-based analytics for{" "}
						<span className="font-medium">{shortcode}</span>
					</p>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
						<h4 className="font-medium text-blue-900 mb-2">Planned Features:</h4>
						<ul className="text-sm text-blue-800 space-y-1">
							<li>• Hourly visit patterns</li>
							<li>• Daily traffic trends</li>
							<li>• Weekly and monthly analytics</li>
							<li>• Peak time identification</li>
							<li>• Time zone analysis</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
