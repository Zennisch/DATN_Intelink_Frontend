import axios from "axios";

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

export interface DimensionStatistic {
	value: string;
	clicks: number;
}

export interface DimensionStatisticsResponse {
	dimension: string;
	limit: number;
	from: string | null;
	to: string | null;
	stats: DimensionStatistic[];
}

export type DimensionType = 
	| "COUNTRY" 
	| "REFERRER" 
	| "REFERRER_TYPE" 
	| "UTM_SOURCE" 
	| "UTM_MEDIUM" 
	| "UTM_CAMPAIGN" 
	| "BROWSER" 
	| "OS" 
	| "DEVICE_TYPE" 
	| "CITY" 
	| "REGION" 
	| "TIMEZONE" 
	| "ISP" 
	| "LANGUAGE";

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

		const response = await axios.get(`/statistics/by-country?${params.toString()}`);
		return response.data;
	}

	static async getTimeSeriesStatistics(
		granularity: "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY" = "DAILY",
		from?: string,
		to?: string
	): Promise<TimeSeriesResponse> {
		const params = new URLSearchParams();
		params.append("granularity", granularity);
		if (from) params.append("from", from);
		if (to) params.append("to", to);

		const response = await axios.get(`/statistics/timeseries?${params.toString()}`);
		return response.data;
	}

	static async getDimensionStatistics(
		dimension: DimensionType = "COUNTRY",
		from?: string,
		to?: string,
		limit: number = 20,
		shortCodes?: string
	): Promise<DimensionStatisticsResponse> {
		const params = new URLSearchParams();
		params.append("dimension", dimension);
		params.append("limit", limit.toString());
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (shortCodes) params.append("shortCodes", shortCodes);

		const response = await axios.get(`/statistics/by-dimension?${params.toString()}`);
		return response.data;
	}
}
