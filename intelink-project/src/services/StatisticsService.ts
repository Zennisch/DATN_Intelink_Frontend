import axios from 'axios';
import type { DimensionType, StatisticsData, StatisticsResponse } from '../types/statistics';

export type { StatisticsData, StatisticsResponse };

export interface TimeSeriesDataPoint {
	time: string;
	clicks: number;
}

export interface TimeSeriesResponse {
	granularity: string;
	from: string;
	to: string;
	totalClicks: number;
	buckets: TimeSeriesDataPoint[];
}

export interface TopPeakTimesResponse {
	granularity: string;
	total: number;
	topPeakTimes: { time: string; clicks: number }[];
}

export class StatisticsService {
	private static unwrapResponse(data: any): any {
		if (Array.isArray(data) && data.length === 2 && typeof data[0] === 'string') {
			return data[1];
		}
		return data;
	}

	/**
	 * Get statistics for a specific dimension
	 */
	static async getDimensionStatistics(
		shortCode: string,
		dimensionType: DimensionType
	): Promise<StatisticsResponse> {
		let endpoint = '';
		switch (dimensionType) {
			case 'BROWSER': endpoint = 'browser'; break;
			case 'OS': endpoint = 'os'; break;
			case 'DEVICE_TYPE': endpoint = 'device'; break;
			case 'COUNTRY': endpoint = 'country'; break;
			case 'CITY': endpoint = 'city'; break;
			case 'REFERRER': endpoint = 'referrer'; break;
			case 'REFERRER_TYPE': endpoint = 'referrer-type'; break;
			case 'UTM_SOURCE': endpoint = 'utm-source'; break;
			case 'UTM_MEDIUM': endpoint = 'utm-medium'; break;
			case 'UTM_CAMPAIGN': endpoint = 'utm-campaign'; break;
			case 'UTM_TERM': endpoint = 'utm-term'; break;
			case 'UTM_CONTENT': endpoint = 'utm-content'; break;
			case 'REGION': endpoint = 'region'; break;
			case 'TIMEZONE': endpoint = 'timezone'; break;
			case 'ISP': endpoint = 'isp'; break;
			case 'LANGUAGE': endpoint = 'language'; break;
			default:
				endpoint = dimensionType.toLowerCase().replace(/_/g, '-');
		}

		const response = await axios.get(`/statistics/${shortCode}/${endpoint}`);
		return this.unwrapResponse(response.data);
	}

	/**
	 * Get time series statistics
	 */
	static async getTimeSeriesStatistics(
		shortCode: string,
		granularity: string,
		from?: string,
		to?: string
	): Promise<TimeSeriesResponse> {
		const params = new URLSearchParams();
		params.append('granularity', granularity);
		if (from) params.append('from', from);
		if (to) params.append('to', to);

		const response = await axios.get(`/statistics/${shortCode}/timeseries?${params.toString()}`);
		
		const data = this.unwrapResponse(response.data);
		return {
			granularity: data.granularity,
			from: data.from,
			to: data.to,
			totalClicks: data.totalClicks,
			buckets: (data.data || []).map((item: any) => ({
				time: item.bucketStart,
				clicks: item.clicks
			}))
		};
	}

	/**
	 * Get top peak times
	 */
	static async getTopPeakTimes(
		shortCode: string,
		granularity: string,
		from?: string,
		to?: string
	): Promise<TopPeakTimesResponse> {
		const params = new URLSearchParams();
		params.append('granularity', granularity);
		if (from) params.append('from', from);
		if (to) params.append('to', to);
		params.append('limit', '10');

		const response = await axios.get(`/statistics/${shortCode}/peak-times?${params.toString()}`);
		
		const data = this.unwrapResponse(response.data);
		return {
			granularity: data.granularity,
			total: data.totalBuckets || 0,
			topPeakTimes: (data.data || []).map((item: any) => ({
				time: item.bucketStart,
				clicks: item.clicks
			}))
		};
	}
}
