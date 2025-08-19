import React from "react";
import { CountryMapChart } from "./CountryMapChart";
import { useStatistics } from "../../hooks/useStatistics";
import { DimensionType } from "../../types/statistics";

interface LocationStatisticsProps {
	shortcode: string;
}

export const LocationStatistics: React.FC<LocationStatisticsProps> = ({
	shortcode,
}) => {
	// Fetch country statistics data
	const { data, loading, error } = useStatistics(shortcode, [DimensionType.COUNTRY]);

	if (loading) {
		return (
			<div className="p-6">
				<div className="animate-pulse space-y-6">
					<div className="h-8 bg-gray-200 rounded w-1/3"></div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="h-96 bg-gray-200 rounded"></div>
						<div className="h-96 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-6">
				<div className="text-red-600 text-center">
					Error loading location statistics: {error}
				</div>
			</div>
		);
	}

	const countryData = data && data[DimensionType.COUNTRY] 
		? data[DimensionType.COUNTRY].data || [] 
		: [];

	return (
		<div className="p-6 space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Country Map */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Visitors by Country
					</h3>
					<CountryMapChart 
						data={countryData} 
						title="Visitors by Country"
					/>
				</div>

				{/* Top Countries List */}
				<div className="bg-white rounded-lg border border-gray-200 p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Top Countries
					</h3>
					<div className="space-y-3">
						{countryData.length > 0 ? (
							countryData
								.sort((a, b) => b.clicks - a.clicks)
								.slice(0, 10)
								.map((country, index) => (
									<div key={country.name} className="flex items-center justify-between py-2">
										<div className="flex items-center space-x-3">
											<span className="text-sm font-medium text-gray-600">
												#{index + 1}
											</span>
											<span className="text-sm font-medium">{country.name}</span>
										</div>
										<div className="text-right">
											<span className="text-sm font-semibold">{country.clicks}</span>
											<span className="text-xs text-gray-500 ml-2">
												({country.percentage.toFixed(1)}%)
											</span>
										</div>
									</div>
								))
						) : (
							<div className="text-gray-500 text-center py-8">
								No country data available
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Additional location metrics */}
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">
					Regional Summary
				</h3>
				{countryData.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center">
							<div className="text-2xl font-bold text-blue-600">
								{countryData.length}
							</div>
							<div className="text-sm text-gray-500">Countries</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-green-600">
								{countryData.reduce((sum, country) => sum + country.clicks, 0)}
							</div>
							<div className="text-sm text-gray-500">Total Visits</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-purple-600">
								{countryData[0]?.name || "N/A"}
							</div>
							<div className="text-sm text-gray-500">Top Country</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-orange-600">
								{countryData[0]?.percentage.toFixed(1) || "0"}%
							</div>
							<div className="text-sm text-gray-500">Top Share</div>
						</div>
					</div>
				) : (
					<div className="text-gray-500 text-center py-8">
						No regional data available
					</div>
				)}
			</div>
		</div>
	);
};
