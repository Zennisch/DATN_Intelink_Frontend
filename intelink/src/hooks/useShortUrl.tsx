import {createContext, useContext, useState, type ReactNode} from 'react';
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

	const setLoading = (isLoading: boolean) => {
		setShortUrlState((prev) => ({...prev, isLoading}));
	};

	const triggerRefresh = () => {
		setShortUrlState((prev) => ({...prev, refreshSignal: prev.refreshSignal + 1}));
	};

	const createShortUrl = async (request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
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
	};

	const getShortUrls = async (params?: GetShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
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
	};

	const searchShortUrls = async (params?: SearchShortUrlsParams): Promise<PagedResponse<ShortUrlResponse>> => {
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
	};

	const getShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
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
	};

	const updateShortUrl = async (
		shortCode: string,
		request: UpdateShortUrlRequest
	): Promise<UpdateShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.updateShortUrl(shortCode, request);
			// Update current short URL if it's the one being updated
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			}
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to update short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteShortUrl = async (shortCode: string): Promise<void> => {
		try {
			setLoading(true);
			await ShortUrlService.deleteShortUrl(shortCode);
			// Clear current short URL if it's the one being deleted
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: null}));
			}
			triggerRefresh();
		} catch (error) {
			console.error('Failed to delete short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const enableShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.enableShortUrl(shortCode);
			// Update current short URL if it's the one being enabled
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			}
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to enable short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const disableShortUrl = async (shortCode: string): Promise<ShortUrlResponse> => {
		try {
			setLoading(true);
			const response = await ShortUrlService.disableShortUrl(shortCode);
			// Update current short URL if it's the one being disabled
			if (shortUrlState.currentShortUrl?.shortCode === shortCode) {
				setShortUrlState((prev) => ({...prev, currentShortUrl: response}));
			}
			triggerRefresh();
			return response;
		} catch (error) {
			console.error('Failed to disable short URL:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const setCurrentShortUrl = (shortUrl: ShortUrlResponse | null) => {
		setShortUrlState((prev) => ({...prev, currentShortUrl: shortUrl}));
	};

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
