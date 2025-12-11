import {createContext, useContext, useState, type ReactNode, useCallback} from 'react';
import type {
	CreateShortUrlRequest,
	CreateShortUrlResponse,
	ShortUrlResponse,
	UpdateShortUrlRequest,
	UpdateShortUrlResponse,
} from '../dto/ShortUrlDTO';
import type {PagedResponse} from '../dto/PagedResponse';
import {ShortUrlService, type GetShortUrlsParams, type SearchShortUrlsParams} from '../services/ShortUrlService';
import type { SearchShortUrlRequest } from '../dto/request/ShortUrlRequest';
import { ShortUrlStatus } from '../types/enums';

// Helper to normalize backend data
const normalizeShortUrlData = (data: any): ShortUrlResponse => {
    return {
        ...data,
        // Map 'enabled' to 'status' if 'status' is missing
        status: data.status || (data.enabled ? ShortUrlStatus.ENABLED : ShortUrlStatus.DISABLED),
        // Convert Unix timestamp (seconds) to ISO string
        createdAt: typeof data.createdAt === 'number' ? new Date(data.createdAt * 1000).toISOString() : data.createdAt,
        updatedAt: typeof data.updatedAt === 'number' ? new Date(data.updatedAt * 1000).toISOString() : data.updatedAt,
        expiresAt: typeof data.expiresAt === 'number' ? new Date(data.expiresAt * 1000).toISOString() : data.expiresAt,
    };
};

const processPagedResponse = (response: PagedResponse<any>): PagedResponse<ShortUrlResponse> => {
    let content = response.content;
    
    // Handle Java backend serialization quirk where list is [className, actualList]
    if (Array.isArray(content) && content.length === 2 && typeof content[0] === 'string' && Array.isArray(content[1])) {
        content = content[1];
    }

    return {
        ...response,
        content: Array.isArray(content) ? content.map(normalizeShortUrlData) : []
    };
};

export interface ShortUrlState {
	loading: boolean;
	currentShortUrl: ShortUrlResponse | null;
	shortUrls: ShortUrlResponse[];
	totalElements: number;
	totalPages: number;
	error: string | null;
}

export interface ShortUrlContextType extends ShortUrlState {
	createShortUrl: (request: CreateShortUrlRequest) => Promise<CreateShortUrlResponse | null>;
	getShortUrls: (params?: GetShortUrlsParams) => Promise<PagedResponse<ShortUrlResponse>>;
	searchShortUrls: (params?: SearchShortUrlsParams) => Promise<PagedResponse<ShortUrlResponse>>;
	fetchShortUrls: (params: SearchShortUrlRequest) => Promise<void>;
	getShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	updateShortUrl: (shortCode: string, request: UpdateShortUrlRequest) => Promise<UpdateShortUrlResponse>;
	deleteShortUrl: (shortCode: string) => Promise<void>;
	enableShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	disableShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	setCurrentShortUrl: (shortUrl: ShortUrlResponse | null) => void;
	clearError: () => void;
}

export const ShortUrlContext = createContext<ShortUrlContextType | undefined>(undefined);

interface ShortUrlProviderProps {
	children: ReactNode;
}

export const ShortUrlProvider: React.FC<ShortUrlProviderProps> = ({children}) => {
	const [shortUrlState, setShortUrlState] = useState<ShortUrlState>({
		loading: false,
		currentShortUrl: null,
		shortUrls: [],
		totalElements: 0,
		totalPages: 0,
		error: null,
	});

	const setLoading = (loading: boolean) => {
		setShortUrlState((prev) => ({...prev, loading}));
	};

	const setError = (error: string | null) => {
		setShortUrlState((prev) => ({...prev, error}));
	};

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const createShortUrl = async (request: CreateShortUrlRequest): Promise<CreateShortUrlResponse | null> => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.createShortUrl(request);
			return response;
		} catch (error: any) {
			console.error('Failed to create short URL:', error);
			setError(error.response?.data?.message || 'Failed to create short URL');
			return null;
		} finally {
			setLoading(false);
		}
	};

	const getShortUrls = async (params?: GetShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
		try {
			setLoading(true);
			setError(null);
			const rawResponse = await ShortUrlService.getShortUrls(params);
			const response = processPagedResponse(rawResponse);
			setShortUrlState((prev) => ({
				...prev,
				shortUrls: response.content,
				totalElements: response.totalElements,
				totalPages: response.totalPages,
			}));
			return response;
		} catch (error: any) {
			console.error('Failed to get short URLs:', error);
			setError(error.response?.data?.message || 'Failed to get short URLs');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const searchShortUrls = async (params?: SearchShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
		try {
			setLoading(true);
			setError(null);
			const rawResponse = await ShortUrlService.searchShortUrls(params);
			const response = processPagedResponse(rawResponse);
			console.log('searchShortUrls processed response:', response);
			setShortUrlState((prev) => ({
				...prev,
				shortUrls: response.content,
				totalElements: response.totalElements,
				totalPages: response.totalPages,
			}));
			return response;
		} catch (error: any) {
			console.error('Failed to search short URLs:', error);
			setError(error.response?.data?.message || 'Failed to search short URLs');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const fetchShortUrls = useCallback(async (params: SearchShortUrlRequest) => {
		try {
			setLoading(true);
			setError(null);
			const serviceParams: SearchShortUrlsParams = {
				query: params.query,
				status: params.status,
				sortBy: params.sortBy,
				direction: params.sortDirection as 'asc' | 'desc',
				page: params.page,
				size: params.size,
			};
			const rawResponse = await ShortUrlService.searchShortUrls(serviceParams);
			const response = processPagedResponse(rawResponse);
			console.log('fetchShortUrls processed response:', response);
			setShortUrlState((prev) => ({
				...prev,
				shortUrls: response.content,
				totalElements: response.totalElements,
				totalPages: response.totalPages,
			}));
		} catch (error: any) {
			console.error('Failed to fetch short URLs:', error);
			setError(error.response?.data?.message || 'Failed to fetch short URLs');
		} finally {
			setLoading(false);
		}
	}, []);

	const getShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.getShortUrl(shortCode);
			setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			return response;
		} catch (error: any) {
			console.error('Failed to get short URL:', error);
			setError(error.response?.data?.message || 'Failed to get short URL');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateShortUrl = async (
		shortCode: string,
		request: UpdateShortUrlRequest
	): Promise<UpdateShortUrlResponse> => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.updateShortUrl(shortCode, request);
			setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			return response;
		} catch (error: any) {
			console.error('Failed to update short URL:', error);
			setError(error.response?.data?.message || 'Failed to update short URL');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteShortUrl = async (shortCode: string): Promise<void> => {
		try {
			setLoading(true);
			setError(null);
			await ShortUrlService.deleteShortUrl(shortCode);
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: null}));
			}
		} catch (error: any) {
			console.error('Failed to delete short URL:', error);
			setError(error.response?.data?.message || 'Failed to delete short URL');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const enableShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.enableShortUrl(shortCode);
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			}
			return response;
		} catch (error: any) {
			console.error('Failed to enable short URL:', error);
			setError(error.response?.data?.message || 'Failed to enable short URL');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const disableShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.disableShortUrl(shortCode);
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			}
			return response;
		} catch (error: any) {
			console.error('Failed to disable short URL:', error);
			setError(error.response?.data?.message || 'Failed to disable short URL');
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const setCurrentShortUrl = (shortUrl: ShortUrlResponse | null) => {
		setShortUrlState((prev) => ({...prev, currentShortUrl: shortUrl}));
	};

	return (
		<ShortUrlContext.Provider
			value={{
				...shortUrlState,
				createShortUrl,
				getShortUrls,
				searchShortUrls,
				fetchShortUrls,
				getShortUrl,
				updateShortUrl,
				deleteShortUrl,
				enableShortUrl,
				disableShortUrl,
				setCurrentShortUrl,
				clearError,
			}}
		>
			{children}
		</ShortUrlContext.Provider>
	);
};

export const useShortUrl = (): ShortUrlContextType => {
	const context = useContext(ShortUrlContext);
	if (context === undefined) {
		throw new Error('useShortUrl must be used within an ShortUrlProvider');
	}
	return context;
};
