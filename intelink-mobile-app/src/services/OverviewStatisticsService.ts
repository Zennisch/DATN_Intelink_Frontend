import axios from "axios";
import type {
	DimensionStatResponse,
	GeographyStatResponse,
	TimeSeriesStatResponse,
} from "../dto/StatisticsDTO";

export type DimensionType = 
	| "BROWSER" 
	| "OS" 
	| "DEVICE_TYPE" 
	| "COUNTRY" 
	| "CITY";

export type Granularity = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";

export class OverviewStatisticsService {
	static async getCountryStatistics(
		from?: string,
		to?: string,
		limit: number = 10,
		shortCodes?: string
	): Promise<GeographyStatResponse> {
		const params = new URLSearchParams();
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (limit) params.append("limit", limit.toString());
		if (shortCodes) params.append("shortCodes", shortCodes);

		const response = await axios.get(`/statistics/country?${params.toString()}`);
		return response.data;
	}

	static async getTimeSeriesStatistics(
		granularity: Granularity = "DAILY",
		from?: string,
		to?: string,
		shortCodes?: string
	): Promise<TimeSeriesStatResponse> {
		const params = new URLSearchParams();
		params.append("granularity", granularity);
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (shortCodes) params.append("shortCodes", shortCodes);

		const response = await axios.get(`/statistics/timeseries?${params.toString()}`);
		return response.data;
	}

	static async getDimensionStatistics(
		dimension: DimensionType = "COUNTRY",
		from?: string,
		to?: string,
		limit: number = 20,
		shortCodes?: string
	): Promise<DimensionStatResponse | GeographyStatResponse> {
		const params = new URLSearchParams();
		// params.append("dimension", dimension); // Dimension is now in the URL
		params.append("limit", limit.toString());
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (shortCodes) params.append("shortCodes", shortCodes);

		let endpoint = "";
		switch (dimension) {
			case "BROWSER":
				endpoint = "/statistics/browser";
				break;
			case "OS":
				endpoint = "/statistics/os";
				break;
			case "DEVICE_TYPE":
				endpoint = "/statistics/device";
				break;
			case "COUNTRY":
				endpoint = "/statistics/country";
				break;
			case "CITY":
				endpoint = "/statistics/city";
				break;
			default:
				throw new Error(`Unsupported dimension: ${dimension}`);
		}

		const response = await axios.get(`${endpoint}?${params.toString()}`);
		return response.data;
	}
}
