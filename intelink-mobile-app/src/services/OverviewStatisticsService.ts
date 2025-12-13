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
		timezone?: string
	): Promise<GeographyStatResponse> {
		const params = new URLSearchParams();
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (timezone) params.append("timezone", timezone);

		const response = await axios.get(`/statistics/country?${params.toString()}`);
		return response.data;
	}

	static async getTimeSeriesStatistics(
		granularity: Granularity = "DAILY",
		from?: string,
		to?: string,
		timezone?: string
	): Promise<TimeSeriesStatResponse> {
		const params = new URLSearchParams();
		params.append("granularity", granularity);
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (timezone) params.append("timezone", timezone);

		const response = await axios.get(`/statistics/timeseries?${params.toString()}`);
		return response.data;
	}

	static async getDimensionStatistics(
		dimension: DimensionType = "COUNTRY",
		from?: string,
		to?: string,
		timezone?: string
	): Promise<DimensionStatResponse | GeographyStatResponse> {
		const params = new URLSearchParams();
		if (from) params.append("from", from);
		if (to) params.append("to", to);
		if (timezone) params.append("timezone", timezone);

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
