import api from './AxiosConfig';

// Align types with intelink-project legacy
export interface CreateShortUrlRequest {
	originalUrl: string;
	customCode?: string;
	password?: string;
	description?: string;
	maxUsage?: number;
	availableDays: number;
}

export interface UpdateShortUrlRequest {
	description?: string;
	maxUsage?: number;
	availableDays?: number;
}

export interface CreateShortUrlResponse {
	id: number;
	shortCode: string;
	originalUrl: string;
	hasPassword: boolean;
	description?: string;
	status: string;
	maxUsage?: number;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	shortUrl: string;
}

export interface ShortUrlListResponse {
	id: number;
	shortCode: string;
	originalUrl: string;
	hasPassword: boolean;
	description?: string;
	status: string;
	maxUsage?: number;
	totalClicks: number;
	expiresAt: string;
	createdAt: string;
	shortUrl: string;
}

export interface ShortUrlDetailResponse {
	id: number;
	shortCode: string;
	originalUrl: string;
	hasPassword: boolean;
	description?: string;
	status: string;
	maxUsage?: number;
	totalClicks: number;
	expiresAt: string;
	createdAt: string;
	updatedAt: string;
	shortUrl: string;
}

export interface UpdateShortUrlResponse {
	message: string;
	shortCode?: string;
	success: boolean;
}

export interface SearchShortUrlRequest {
	query?: string;
	status?: string;
	sortBy?: string;
	sortDirection?: string;
	page?: number;
	size?: number;
}

export interface PagedResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	empty?: boolean;
}

export interface UnlockUrlResponse {
	success: boolean;
	message: string;
	redirectUrl?: string;
	shortCode: string;
}

const buildParams = (search: Partial<SearchShortUrlRequest>) => {
	const params = new URLSearchParams();
	Object.entries(search).forEach(([key, value]) => {
		if (value !== undefined) {
			params.append(key, value.toString());
		}
	});
	return params.toString();
};

export class ShortUrlService {
	static async createShortUrl(request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
		const response = await api.post<CreateShortUrlResponse>('/api/v1/url', request);
		return response.data;
	}

	static async getShortUrls(search: SearchShortUrlRequest = {}): Promise<PagedResponse<ShortUrlListResponse>> {
		const params = buildParams({ page: search.page, size: search.size });
		const response = await api.get<PagedResponse<ShortUrlListResponse>>(`/api/v1/url?${params}`);
		return response.data;
	}

	static async searchShortUrls(search: SearchShortUrlRequest): Promise<PagedResponse<ShortUrlListResponse>> {
		const params = buildParams(search);
		const response = await api.get<PagedResponse<ShortUrlListResponse>>(`/api/v1/url/search?${params}`);
		return response.data;
	}


	static async getShortUrlByCode(shortCode: string): Promise<ShortUrlDetailResponse> {
		const response = await api.get<ShortUrlDetailResponse>(`/api/v1/url/${shortCode}`);
		return response.data;
	}

	static async updateShortUrl(shortCode: string, request: UpdateShortUrlRequest): Promise<UpdateShortUrlResponse> {
		const response = await api.put<UpdateShortUrlResponse>(`/api/v1/url/${shortCode}`, request);
		return response.data;
	}

	static async deleteShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await api.delete<UpdateShortUrlResponse>(`/api/v1/url/${shortCode}`);
		return response.data;
	}

	static async enableShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await api.put<UpdateShortUrlResponse>(`/api/v1/url/${shortCode}/enable`);
		return response.data;
	}

	static async disableShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await api.put<UpdateShortUrlResponse>(`/api/v1/url/${shortCode}/disable`);
		return response.data;
	}

	static async updatePassword(shortCode: string, currentPassword: string, newPassword: string): Promise<UpdateShortUrlResponse> {
		const response = await api.put<UpdateShortUrlResponse>(`/api/v1/url/${shortCode}/password`, {
			currentPassword,
			newPassword,
		});
		return response.data;
	}

	static async getUnlockInfo(shortCode: string): Promise<UnlockUrlResponse> {
		const response = await api.get(`${shortCode}/unlock`);
		return response.data;
	}

	static async unlockUrl(shortCode: string, password: string): Promise<UnlockUrlResponse> {
		const response = await api.post(`${shortCode}/unlock`, { password });
		return response.data;
	}

	// Statistics are fetched via StatisticsService below per dimension
}

// Statistics
export const DimensionType = {
	REFERRER: 'REFERRER',
	REFERRER_TYPE: 'REFERRER_TYPE',
	UTM_SOURCE: 'UTM_SOURCE',
	UTM_MEDIUM: 'UTM_MEDIUM',
	UTM_CAMPAIGN: 'UTM_CAMPAIGN',
	UTM_TERM: 'UTM_TERM',
	UTM_CONTENT: 'UTM_CONTENT',
	COUNTRY: 'COUNTRY',
	REGION: 'REGION',
	CITY: 'CITY',
	TIMEZONE: 'TIMEZONE',
	BROWSER: 'BROWSER',
	OS: 'OS',
	DEVICE_TYPE: 'DEVICE_TYPE',
	ISP: 'ISP',
	LANGUAGE: 'LANGUAGE',
	CUSTOM: 'CUSTOM',
} as const;

export type DimensionTypeT = (typeof DimensionType)[keyof typeof DimensionType];

export interface StatisticsData {
	name: string;
	clicks: number;
	percentage: number;
}

export interface StatisticsResponse {
	data: StatisticsData[];
	totalClicks: number;
	category: string;
}

export class StatisticsService {
	static async getByDimension(shortcode: string, type: DimensionTypeT): Promise<StatisticsResponse> {
		const response = await api.get<StatisticsResponse>(`/api/v1/statistics/${shortcode}/dimension`, {
			params: { type },
		});
		return response.data;
	}
}

// Time-series statistics
export type TimeGranularity = 'HOURLY' | 'DAILY' | 'MONTHLY' | 'YEARLY';

export interface TimeBucket { time: string; clicks: number }
export interface TimeSeriesResponse {
	granularity: TimeGranularity;
	from: string;
	to: string;
	totalClicks: number;
	buckets: TimeBucket[];
}

export interface TopPeakTimesResponse {
	granularity: TimeGranularity;
	total: number;
	topPeakTimes: { time: string; clicks: number }[];
}

export class TimeStatisticsService {
	static async getTimeSeries(shortcode: string, params: { customFrom?: string; customTo?: string; granularity: TimeGranularity }): Promise<TimeSeriesResponse> {
		const res = await api.get<TimeSeriesResponse>(`/api/v1/statistics/${shortcode}/time`, { params });
		return res.data;
	}

	static async getTopPeakTimes(shortcode: string, granularity: TimeGranularity): Promise<TopPeakTimesResponse> {
		const res = await api.get<TopPeakTimesResponse>(`/api/v1/statistics/${shortcode}/top-peak-times`, { params: { granularity: granularity.toLowerCase?.() || granularity } as any });
		return res.data;
	}
}
