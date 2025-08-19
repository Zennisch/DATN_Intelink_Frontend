import axios from "axios";
import type {
	CreateShortUrlRequest,
	UpdateShortUrlRequest,
	SearchShortUrlRequest,
} from "../dto/request/ShortUrlRequest";
import type {
	CreateShortUrlResponse,
	ShortUrlListResponse,
	ShortUrlDetailResponse,
	UpdateShortUrlResponse,
	PagedResponse,
} from "../dto/response/ShortUrlResponse";

export class ShortUrlService {
	/**
	 * Create a new short URL - POST /url
	 * @param request CreateShortUrlRequest
	 * @returns CreateShortUrlResponse
	 */
	static async createShortUrl(
		request: CreateShortUrlRequest,
	): Promise<CreateShortUrlResponse> {
		try {
			const response = await axios.post("/url", request);
			return response.data;
		} catch (error) {
			console.error("Error creating short URL:", error);
			throw error;
		}
	}

	/**
	 * Get all short URLs for the authenticated user with pagination - GET /url
	 * @param search SearchShortUrlRequest
	 * @returns PagedResponse<ShortUrlListResponse>
	 */
	static async getShortUrls(
		search: SearchShortUrlRequest = {},
	): Promise<PagedResponse<ShortUrlListResponse>> {
		try {
			const params = new URLSearchParams();

			if (search.page !== undefined) {
				params.append("page", search.page.toString());
			}
			if (search.size !== undefined) {
				params.append("size", search.size.toString());
			}

			const response = await axios.get(`/url?${params.toString()}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching short URLs:", error);
			throw error;
		}
	}

	/**
	 * Search short URLs - GET /url/search
	 * @param search SearchShortUrlRequest
	 * @returns PagedResponse<ShortUrlListResponse>
	 */
	static async searchShortUrls(
		search: SearchShortUrlRequest,
	): Promise<PagedResponse<ShortUrlListResponse>> {
		try {
			const params = new URLSearchParams();

			if (search.page !== undefined) {
				params.append("page", search.page.toString());
			}
			if (search.size !== undefined) {
				params.append("size", search.size.toString());
			}
			if (search.query) {
				params.append("query", search.query);
			}
			if (search.status) {
				params.append("status", search.status);
			}
			if (search.sortBy) {
				params.append("sortBy", search.sortBy);
			}
			if (search.sortDirection) {
				params.append("sortDirection", search.sortDirection);
			}

			const response = await axios.get(`/url/search?${params.toString()}`);
			return response.data;
		} catch (error) {
			console.error("Error searching short URLs:", error);
			throw error;
		}
	}

	/**
	 * Get short URL details by short code - GET /url/{shortCode}
	 * @param shortCode string
	 * @returns ShortUrlDetailResponse
	 */
	static async getShortUrlByCode(
		shortCode: string,
	): Promise<ShortUrlDetailResponse> {
		try {
			const response = await axios.get(`/url/${shortCode}`);
			return response.data;
		} catch (error) {
			console.error("Error fetching short URL by code:", error);
			throw error;
		}
	}

	/**
	 * Update short URL - PUT /url/{shortCode}
	 * @param shortCode string
	 * @param request UpdateShortUrlRequest
	 * @returns UpdateShortUrlResponse
	 */
	static async updateShortUrl(
		shortCode: string,
		request: UpdateShortUrlRequest,
	): Promise<UpdateShortUrlResponse> {
		try {
			const response = await axios.put(`/url/${shortCode}`, request);
			return response.data;
		} catch (error) {
			console.error("Error updating short URL:", error);
			throw error;
		}
	}

	/**
	 * Delete short URL - DELETE /url/{shortCode}
	 * @param shortCode string
	 * @returns UpdateShortUrlResponse
	 */
	static async deleteShortUrl(
		shortCode: string,
	): Promise<UpdateShortUrlResponse> {
		try {
			const response = await axios.delete(`/url/${shortCode}`);
			return response.data;
		} catch (error) {
			console.error("Error deleting short URL:", error);
			throw error;
		}
	}

	/**
	 * Enable short URL - PUT /url/{shortCode}/enable
	 * @param shortCode string
	 * @returns UpdateShortUrlResponse
	 */
	static async enableShortUrl(
		shortCode: string,
	): Promise<UpdateShortUrlResponse> {
		try {
			const response = await axios.put(`/url/${shortCode}/enable`);
			return response.data;
		} catch (error) {
			console.error("Error enabling short URL:", error);
			throw error;
		}
	}

	/**
	 * Disable short URL - PUT /url/{shortCode}/disable
	 * @param shortCode string
	 * @returns UpdateShortUrlResponse
	 */
	static async disableShortUrl(
		shortCode: string,
	): Promise<UpdateShortUrlResponse> {
		try {
			const response = await axios.put(`/url/${shortCode}/disable`);
			return response.data;
		} catch (error) {
			console.error("Error disabling short URL:", error);
			throw error;
		}
	}

	/**
	 * Update password for short URL - PUT /url/{shortCode}/password
	 * @param shortCode string
	 * @param currentPassword string
	 * @param newPassword string
	 * @returns UpdateShortUrlResponse
	 */
	static async updatePassword(
		shortCode: string,
		currentPassword: string,
		newPassword: string,
	): Promise<UpdateShortUrlResponse> {
		try {
			const response = await axios.put(`/url/${shortCode}/password`, {
				currentPassword,
				newPassword,
			});
			return response.data;
		} catch (error) {
			console.error("Error updating short URL password:", error);
			throw error;
		}
	}

	/**
	 * Get basic info about a short URL (for unlock page) - GET /{shortCode}/unlock
	 * @param shortCode string
	 * @returns Basic URL info for unlock page
	 */
	static async getUnlockInfo(shortCode: string): Promise<{
		success: boolean;
		message: string;
		shortCode: string;
	}> {
		try {
			// Create direct URL without /api/v1 prefix for redirect endpoints
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await axios.get(`${backendUrl}/${shortCode}/unlock`);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching unlock info:", error);
			throw error;
		}
	}

	/**
	 * Unlock password-protected URL - POST /{shortCode}/unlock
	 * @param shortCode string
	 * @param password string
	 * @returns Unlock response with original URL if successful
	 */
	static async unlockUrl(shortCode: string, password: string): Promise<{
		success: boolean;
		message: string;
		shortCode: string;
		originalUrl?: string;
	}> {
		try {
			// Create direct URL without /api/v1 prefix for redirect endpoints
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await axios.post(`${backendUrl}/${shortCode}/unlock`, {
				password,
			});
			return response.data;
		} catch (error: any) {
			console.error("Error unlocking URL:", error);
			// Re-throw with proper error structure
			if (error.response?.data) {
				throw error.response.data;
			}
			throw error;
		}
	}
}
