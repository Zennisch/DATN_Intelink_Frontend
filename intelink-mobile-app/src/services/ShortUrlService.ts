import axios from 'axios';
import type {
	CreateShortUrlRequest,
	CreateShortUrlResponse,
	ShortUrlResponse,
	UpdateShortUrlRequest,
	UpdateShortUrlResponse,
} from '../dto/ShortUrlDTO';
import type { PagedResponse } from '../dto/PagedResponse';
import type { RedirectResult } from '../models/Redirect';

export interface GetShortUrlsParams {
	page?: number;
	size?: number;
}

export interface SearchShortUrlsParams {
	query?: string;
	status?: string;
	sortBy?: string;
	direction?: 'asc' | 'desc';
	page?: number;
	size?: number;
}

export class ShortUrlService {
	/**
	 * Create a new short URL (supports both authenticated and guest users)
	 */
	static async createShortUrl(request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> {
		const response = await axios.post<CreateShortUrlResponse>('/url', request);
		return response.data;
	}

	/**
	 * Get paginated list of short URLs for authenticated user
	 */
	static async getShortUrls(params?: GetShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> {
		const response = await axios.get<PagedResponse<ShortUrlResponse>>('/url', {
			params: {
				page: params?.page ?? 0,
				size: params?.size ?? 10,
			},
		});
		return response.data;
	}

	/**
	 * Search short URLs with filters
	 */
	static async searchShortUrls(params?: SearchShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> {
		const response = await axios.get<PagedResponse<ShortUrlResponse>>('/url/search', {
			params: {
				query: params?.query,
				status: params?.status,
				sortBy: params?.sortBy ?? 'createdAt',
				direction: params?.direction ?? 'desc',
				page: params?.page ?? 0,
				size: params?.size ?? 10,
			},
		});
		return response.data;
	}

	/**
	 * Get a specific short URL by short code
	 */
	static async getShortUrl(shortCode: string): Promise<ShortUrlResponse> {
		const response = await axios.get<ShortUrlResponse>(`/url/${shortCode}`);
		return response.data;
	}

	/**
	 * Update a short URL
	 */
	static async updateShortUrl(shortCode: string, request: UpdateShortUrlRequest): Promise<UpdateShortUrlResponse> {
		const response = await axios.put<UpdateShortUrlResponse>(`/url/${shortCode}`, request);
		return response.data;
	}

	/**
	 * Delete a short URL (soft delete)
	 */
	static async deleteShortUrl(shortCode: string): Promise<void> {
		await axios.delete(`/url/${shortCode}`);
	}

	/**
	 * Enable a disabled short URL
	 */
	static async enableShortUrl(shortCode: string): Promise<ShortUrlResponse> {
		const response = await axios.put<ShortUrlResponse>(`/url/${shortCode}/enable`);
		return response.data;
	}

	/**
	 * Disable an enabled short URL
	 */
	static async disableShortUrl(shortCode: string): Promise<ShortUrlResponse> {
		const response = await axios.put<ShortUrlResponse>(`/url/${shortCode}/disable`);
		return response.data;
	}

	/**
	 * Access a short URL (redirect)
	 */
	static async accessShortUrl(shortCode: string, password?: string): Promise<RedirectResult> {
		const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.intelink.click';
		const response = await axios.get<RedirectResult>(`${backendUrl}/${shortCode}`, {
			params: { password },
			validateStatus: (status) => status < 500,
		});
		return response.data;
	}
}
