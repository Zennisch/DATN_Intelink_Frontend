import axios from "axios";
import { BACKEND_URL } from "../types/environment";
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
	UnlockUrlResponse,
} from "../dto/response/ShortUrlResponse";

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
		const response = await axios.post("/url", request);
		return response.data;
	}

	static async getShortUrls(search: SearchShortUrlRequest = {}): Promise<PagedResponse<ShortUrlListResponse>> {
		const params = buildParams({ page: search.page, size: search.size });
		const response = await axios.get(`/url?${params}`);
		return response.data;
	}

	static async searchShortUrls(search: SearchShortUrlRequest): Promise<PagedResponse<ShortUrlListResponse>> {
		const params = buildParams(search);
		const response = await axios.get(`/url/search?${params}`);
		return response.data;
	}

	static async getShortUrlByCode(shortCode: string): Promise<ShortUrlDetailResponse> {
		const response = await axios.get(`/url/${shortCode}`);
		return response.data;
	}

	static async updateShortUrl(shortCode: string, request: UpdateShortUrlRequest): Promise<UpdateShortUrlResponse> {
		const response = await axios.put(`/url/${shortCode}`, request);
		return response.data;
	}

	static async deleteShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await axios.delete(`/url/${shortCode}`);
		return response.data;
	}

	static async enableShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await axios.put(`/url/${shortCode}/enable`);
		return response.data;
	}

	static async disableShortUrl(shortCode: string): Promise<UpdateShortUrlResponse> {
		const response = await axios.put(`/url/${shortCode}/disable`);
		return response.data;
	}

	static async updatePassword(shortCode: string, currentPassword: string, newPassword: string): Promise<UpdateShortUrlResponse> {
		const response = await axios.put(`/url/${shortCode}/password`, {
			currentPassword,
			newPassword,
		});
		return response.data;
	}

	static async getUnlockInfo(shortCode: string): Promise<UnlockUrlResponse> {
		const response = await axios.get(`${BACKEND_URL}/${shortCode}/unlock`);
		return response.data;
	}

	static async unlockUrl(shortCode: string, password: string): Promise<UnlockUrlResponse> {
		const response = await axios.post(`${BACKEND_URL}/${shortCode}/unlock`, { password });
		return response.data;
	}
}
