import React, { createContext, type ReactNode, useState, useCallback } from "react";
import { ShortUrlService } from "../services/ShortUrlService.ts";
import type {
	CreateShortUrlRequest,
	UpdateShortUrlRequest,
	SearchShortUrlRequest,
} from "../dto/request/ShortUrlRequest.ts";
import type {
	CreateShortUrlResponse,
	ShortUrlListResponse,
	UpdateShortUrlResponse,
} from "../dto/response/ShortUrlResponse.ts";

export interface ShortUrlContextType {
	shortUrls: ShortUrlListResponse[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	loading: boolean;
	error: string | null;
	fetchShortUrls: (searchParams?: SearchShortUrlRequest) => Promise<void>;
	createShortUrl: (request: CreateShortUrlRequest) => Promise<CreateShortUrlResponse | null>;
	updateShortUrl: (shortCode: string, request: UpdateShortUrlRequest) => Promise<UpdateShortUrlResponse | null>;
	deleteShortUrl: (shortCode: string) => Promise<boolean>;
	enableShortUrl: (shortCode: string) => Promise<UpdateShortUrlResponse | null>;
	disableShortUrl: (shortCode: string) => Promise<UpdateShortUrlResponse | null>;
	clearError: () => void;
}

export const ShortUrlContext = createContext<ShortUrlContextType | undefined>(undefined);

interface ShortUrlProviderProps {
	children: ReactNode;
}

interface ShortUrlState {
	shortUrls: ShortUrlListResponse[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	loading: boolean;
	error: string | null;
}

export const ShortUrlProvider: React.FC<ShortUrlProviderProps> = ({ children }) => {
	const [state, setState] = useState<ShortUrlState>({
		shortUrls: [],
		totalElements: 0,
		totalPages: 0,
		currentPage: 0,
		loading: false,
		error: null,
	});

	const fetchShortUrls = useCallback(async (searchParams: SearchShortUrlRequest = {}) => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			let response;
			if (searchParams.query || searchParams.status || searchParams.sortBy) {
				response = await ShortUrlService.searchShortUrls(searchParams);
			} else {
				response = await ShortUrlService.getShortUrls(searchParams);
			}
			setState((prev) => ({
				...prev,
				shortUrls: response.content,
				totalElements: response.totalElements,
				totalPages: response.totalPages,
				currentPage: response.page,
				loading: false,
			}));
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to fetch short URLs",
			}));
		}
	}, []);

	const createShortUrl = useCallback(async (request: CreateShortUrlRequest): Promise<CreateShortUrlResponse | null> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await ShortUrlService.createShortUrl(request);
			await fetchShortUrls();
			return response;
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to create short URL",
			}));
			return null;
		}
	}, [fetchShortUrls]);

	const updateShortUrl = useCallback(async (shortCode: string, request: UpdateShortUrlRequest): Promise<UpdateShortUrlResponse | null> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await ShortUrlService.updateShortUrl(shortCode, request);
			await fetchShortUrls();
			return response;
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to update short URL",
			}));
			return null;
		}
	}, [fetchShortUrls]);

	const deleteShortUrl = useCallback(async (shortCode: string): Promise<boolean> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			await ShortUrlService.deleteShortUrl(shortCode);
			await fetchShortUrls();
			return true;
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to delete short URL",
			}));
			return false;
		}
	}, [fetchShortUrls]);

	const enableShortUrl = useCallback(async (shortCode: string): Promise<UpdateShortUrlResponse | null> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await ShortUrlService.enableShortUrl(shortCode);
			await fetchShortUrls();
			return response;
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to enable short URL",
			}));
			return null;
		}
	}, [fetchShortUrls]);

	const disableShortUrl = useCallback(async (shortCode: string): Promise<UpdateShortUrlResponse | null> => {
		setState((prev) => ({ ...prev, loading: true, error: null }));
		try {
			const response = await ShortUrlService.disableShortUrl(shortCode);
			await fetchShortUrls();
			return response;
		} catch (error) {
			setState((prev) => ({
				...prev,
				loading: false,
				error: error instanceof Error ? error.message : "Failed to disable short URL",
			}));
			return null;
		}
	}, [fetchShortUrls]);

	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	const value: ShortUrlContextType = {
		...state,
		fetchShortUrls,
		createShortUrl,
		updateShortUrl,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		clearError,
	};

	return <ShortUrlContext.Provider value={value}>{children}</ShortUrlContext.Provider>;
};
