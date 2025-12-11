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

export interface UpdatePasswordRequest {
	newPassword?: string;
	currentPassword?: string;
}

export interface SearchShortUrlRequest {
	query?: string;
	status?: string;
	sortBy?: string;
	sortDirection?: string;
	page?: number;
	size?: number;
}

export interface UnlockUrlRequest {
    password: string;
}