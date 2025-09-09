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

export interface PagedResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	empty: boolean;
}

export interface UnlockUrlResponse {
    success: boolean;
    message: string;
    redirectUrl?: string;
    shortCode: string;
}
