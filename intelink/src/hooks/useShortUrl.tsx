import {createContext, useContext, useState, useCallback, type ReactNode} from 'react';
import type {
	CreateShortUrlRequest,
	CreateShortUrlResponse,
	ShortUrlResponse,
	UpdateShortUrlRequest,
	UpdateShortUrlResponse,
} from '../dto/ShortUrlDTO';
import type {PagedResponse} from '../dto/PagedResponse';
import {ShortUrlService, type GetShortUrlsParams, type SearchShortUrlsParams} from '../services/ShortUrlService';

export interface ShortUrlState {
	isLoading: boolean;
	currentShortUrl: ShortUrlResponse | null;
	refreshSignal: number;
}

export interface ShortUrlContextType extends ShortUrlState {
	createShortUrl: (request: CreateShortUrlRequest) => Promise<CreateShortUrlResponse>;
	getShortUrls: (params?: GetShortUrlsParams) => Promise<PagedResponse<ShortUrlResponse>>;
	searchShortUrls: (params?: SearchShortUrlsParams) => Promise<PagedResponse<ShortUrlResponse>>;
	getShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	updateShortUrl: (shortCode: string, request: UpdateShortUrlRequest) => Promise<UpdateShortUrlResponse>;
	deleteShortUrl: (shortCode: string) => Promise<void>;
	enableShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	disableShortUrl: (shortCode: string) => Promise<ShortUrlResponse>;
	setCurrentShortUrl: (shortUrl: ShortUrlResponse | null) => void;
}

export const ShortUrlContext = createContext<ShortUrlContextType | undefined>(undefined);

interface ShortUrlProviderProps {
	children: ReactNode;
}

export const ShortUrlProvider: React.FC<ShortUrlProviderProps> = ({children}) => {
	const [shortUrlState, setShortUrlState] = useState<ShortUrlState>({
		isLoading: false,
		currentShortUrl: null,
		refreshSignal: 0,
	});

	const setLoading = useCallback((isLoading: boolean) => {
		setShortUrlState((prev) => ({...prev, isLoading}));
	}, []);

	const triggerRefresh = useCallback(() => {
		setShortUrlState((prev) => ({...prev, refreshSignal: prev.refreshSignal + 1}));
	}, []);

	const createShortUrl = useCallback(async (request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.createShortUrl(request);
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to create short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, triggerRefresh]);

	const getShortUrls = useCallback(async (params?: GetShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.getShortUrls(params);
			return response;
		} catch (error) {
			console.error('Failed to get short URLs:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading]);

	const searchShortUrls = useCallback(async (params?: SearchShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.searchShortUrls(params);
			return response;
		} catch (error) {
			console.error('Failed to search short URLs:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading]);

	const getShortUrl = useCallback(async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.getShortUrl(shortCode);
			setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			return response;
		} catch (error) {
			console.error('Failed to get short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading]);

	const updateShortUrl = useCallback(async (
		shortCode: string,
		request: UpdateShortUrlRequest
	): Promise<UpdateShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.updateShortUrl(shortCode, request);
			setShortUrlState((prev) => {
				if (prev.currentShortUrl?.shortCode === shortCode) {
					return {...prev, currentShortUrl: response};
				}
				return prev;
			});
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to update short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, triggerRefresh]);

	const deleteShortUrl = useCallback(async (shortCode: string): Promise<void> => {
		try {
			setLoading(true);
			await ShortUrlService.deleteShortUrl(shortCode);
			setShortUrlState((prev) => {
				if (prev.currentShortUrl?.shortCode === shortCode) {
					return {...prev, currentShortUrl: null};
				}
				return prev;
			});
			triggerRefresh();
		} catch (error) {
			console.error('Failed to delete short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, triggerRefresh]);

	const enableShortUrl = useCallback(async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.enableShortUrl(shortCode);
			setShortUrlState((prev) => {
				if (prev.currentShortUrl?.shortCode === shortCode) {
					return {...prev, currentShortUrl: response};
				}
				return prev;
			});
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to enable short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, triggerRefresh]);

	const disableShortUrl = useCallback(async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.disableShortUrl(shortCode);
			setShortUrlState((prev) => {
				if (prev.currentShortUrl?.shortCode === shortCode) {
					return {...prev, currentShortUrl: response};
				}
				return prev;
			});
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to disable short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [setLoading, triggerRefresh]);

	const setCurrentShortUrl = useCallback((shortUrl: ShortUrlResponse | null) => {
		setShortUrlState((prev) => ({...prev, currentShortUrl: shortUrl}));
	}, []);

	const value: ShortUrlContextType = {
		...shortUrlState,
		createShortUrl,
		getShortUrls,
		searchShortUrls,
		getShortUrl,
		updateShortUrl,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		setCurrentShortUrl,
	};

	return <ShortUrlContext.Provider value={value}>{children}</ShortUrlContext.Provider>;
};

export const useShortUrl = (): ShortUrlContextType => {
	const context = useContext(ShortUrlContext);
	if (context === undefined) {
		throw new Error('useShortUrl must be used within a ShortUrlProvider');
	}
	return context;
};
