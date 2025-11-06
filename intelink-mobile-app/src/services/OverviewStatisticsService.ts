import axios from "./AxiosConfig";

export interface CountryStatistic {
	country: string;
	views: number;
}

export interface CountryStatisticsResponse {
	limit: number;
	from: string;
	to: string;
	data: CountryStatistic[];
}

export interface TimeSeriesDataPoint {
	date: string;
	views: number;
}

export interface TimeSeriesResponse {
	granularity: "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";
	from: string;
	to: string;
	totalViews: number;
	data: TimeSeriesDataPoint[];
}

export type Granularity = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";

export class OverviewStatisticsService {
	static async getCountryStatistics(
		from?: string,
		to?: string,
		limit: number = 10
	): Promise<CountryStatisticsResponse> {
		const params = new URLSearchParams();
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (limit) params.append("limit", limit.toString());

		const response = await axios.get(`/api/v1/statistics/by-country?${params.toString()}`);
		return response.data;
	}

	static async getTimeSeriesStatistics(
		granularity: Granularity = "DAILY",
		from?: string,
		to?: string
	): Promise<TimeSeriesResponse> {
		const params = new URLSearchParams();
		params.append("granularity", granularity);
		if (from) params.append("from", from);
		if (to) params.append("to", to);

		const response = await axios.get(`/api/v1/statistics/timeseries?${params.toString()}`);
		return response.data;
	}
}
