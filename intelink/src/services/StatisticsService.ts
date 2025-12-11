import axios from 'axios';
import type {
	DimensionStatResponse,
	GeographyStatResponse,
	TimeSeriesStatResponse,
	PeakTimeStatResponse,
} from '../dto/StatisticsDTO';

export type DimensionType =
	| 'REFERRER'
	| 'REFERRER_TYPE'
	| 'UTM_SOURCE'
	| 'UTM_MEDIUM'
	| 'UTM_CAMPAIGN'
	| 'UTM_TERM'
	| 'UTM_CONTENT'
	| 'COUNTRY'
	| 'REGION'
	| 'CITY'
	| 'TIMEZONE'
	| 'BROWSER'
	| 'OS'
	| 'DEVICE_TYPE'
	| 'ISP';

export type Granularity = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface TimeSeriesParams {
	granularity?: Granularity;
	from?: string;
	to?: string;
	timezone?: string;
}

export interface PeakTimeParams extends TimeSeriesParams {
	limit?: number;
}

export class StatisticsService {
	/**
	 * Get browser statistics for a short URL
	 */
	static async getBrowserStats(shortCode: string): Promise<DimensionStatResponse> {
		const response = await axios.get<DimensionStatResponse>(`/statistics/${shortCode}/browser`);
		return response.data;
	}

	/**
	 * Get operating system statistics for a short URL
	 */
	static async getOsStats(shortCode: string): Promise<DimensionStatResponse> {
		const response = await axios.get<DimensionStatResponse>(`/statistics/${shortCode}/os`);
		return response.data;
	}

	/**
	 * Get device type statistics for a short URL
	 */
	static async getDeviceStats(shortCode: string): Promise<DimensionStatResponse> {
		const response = await axios.get<DimensionStatResponse>(`/statistics/${shortCode}/device`);
		return response.data;
	}

	/**
	 * Get country statistics for a short URL (with allowed/blocked clicks)
	 */
	static async getCountryStats(shortCode: string): Promise<GeographyStatResponse> {
		const response = await axios.get<GeographyStatResponse>(`/statistics/${shortCode}/country`);
		return response.data;
	}

	/**
	 * Get city statistics for a short URL (with allowed/blocked clicks)
	 */
	static async getCityStats(shortCode: string): Promise<GeographyStatResponse> {
		const response = await axios.get<GeographyStatResponse>(`/statistics/${shortCode}/city`);
		return response.data;
	}

	/**
	 * Get time series statistics for a short URL
	 */
	static async getTimeSeriesStats(shortCode: string, params?: TimeSeriesParams): Promise<TimeSeriesStatResponse> {
		const response = await axios.get<TimeSeriesStatResponse>(`/statistics/${shortCode}/timeseries`, {
			params: {
				granularity: params?.granularity,
				from: params?.from,
				to: params?.to,
				timezone: params?.timezone,
			},
		});
		return response.data;
	}

	/**
	 * Get peak time statistics for a short URL
	 */
	static async getPeakTimeStats(shortCode: string, params?: PeakTimeParams): Promise<PeakTimeStatResponse> {
		const response = await axios.get<PeakTimeStatResponse>(`/statistics/${shortCode}/peak-times`, {
			params: {
				granularity: params?.granularity,
				from: params?.from,
				to: params?.to,
				timezone: params?.timezone,
				limit: params?.limit ?? 10,
			},
		});
		return response.data;
	}
}
