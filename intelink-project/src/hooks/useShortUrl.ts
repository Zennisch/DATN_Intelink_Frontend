import { useState, useEffect, useCallback } from "react";
import { ShortUrlService } from "../services/ShortUrlService";
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
} from "../dto/response/ShortUrlResponse";

interface UseShortUrlsState {
	shortUrls: ShortUrlListResponse[];
	totalElements: number;
	totalPages: number;
	currentPage: number;
	loading: boolean;
	error: string | null;
}

export const useShortUrl = () => {
	const [state, setState] = useState<UseShortUrlsState>({
		shortUrls: [],
		totalElements: 0,
		totalPages: 0,
		currentPage: 0,
		loading: false,
		error: null,
	});

	// Fetch short URLs with search/filter parameters
	const fetchShortUrls = useCallback(
		async (searchParams: SearchShortUrlRequest = {}) => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				let response;
				// If there are search/filter parameters, use searchShortUrls, otherwise use getShortUrls
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
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch short URLs",
				}));
			}
		},
		[],
	);

	// Create a new short URL
	const createShortUrl = useCallback(
		async (
			request: CreateShortUrlRequest,
		): Promise<CreateShortUrlResponse | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				const response = await ShortUrlService.createShortUrl(request);
				// Refresh the list after creation
				await fetchShortUrls();
				return response;
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to create short URL",
				}));
				return null;
			}
		},
		[fetchShortUrls],
	);

	// Update an existing short URL
	const updateShortUrl = useCallback(
		async (
			shortCode: string,
			request: UpdateShortUrlRequest,
		): Promise<UpdateShortUrlResponse | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				const response = await ShortUrlService.updateShortUrl(
					shortCode,
					request,
				);
				// Refresh the list after update
				await fetchShortUrls();
				return response;
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to update short URL",
				}));
				return null;
			}
		},
		[fetchShortUrls],
	);

	// Delete a short URL
	const deleteShortUrl = useCallback(
		async (shortCode: string): Promise<boolean> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				await ShortUrlService.deleteShortUrl(shortCode);
				// Refresh the list after deletion
				await fetchShortUrls();
				return true;
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to delete short URL",
				}));
				return false;
			}
		},
		[fetchShortUrls],
	);

	// Enable short URL
	const enableShortUrl = useCallback(
		async (shortCode: string): Promise<UpdateShortUrlResponse | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				const response = await ShortUrlService.enableShortUrl(shortCode);
				// Refresh the list after status change
				await fetchShortUrls();
				return response;
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to enable short URL",
				}));
				return null;
			}
		},
		[fetchShortUrls],
	);

	// Disable short URL
	const disableShortUrl = useCallback(
		async (shortCode: string): Promise<UpdateShortUrlResponse | null> => {
			setState((prev) => ({ ...prev, loading: true, error: null }));
			try {
				const response = await ShortUrlService.disableShortUrl(shortCode);
				// Refresh the list after status change
				await fetchShortUrls();
				return response;
			} catch (error) {
				setState((prev) => ({
					...prev,
					loading: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to disable short URL",
				}));
				return null;
			}
		},
		[fetchShortUrls],
	);

	// Clear error state
	const clearError = useCallback(() => {
		setState((prev) => ({ ...prev, error: null }));
	}, []);

	return {
		...state,
		fetchShortUrls,
		createShortUrl,
		updateShortUrl,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		clearError,
	};
};

// Hook for managing individual short URL details
export const useShortUrl = (shortCode?: string) => {
	const [shortUrl, setShortUrl] = useState<ShortUrlDetailResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchShortUrlByCode = useCallback(async (code: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await ShortUrlService.getShortUrlByCode(code);
			setShortUrl(response);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Failed to fetch short URL details",
			);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (shortCode) {
			fetchShortUrlByCode(shortCode);
		}
	}, [shortCode, fetchShortUrlByCode]);

	return {
		shortUrl,
		loading,
		error,
		fetchShortUrlByCode,
		clearError: () => setError(null),
	};
};
