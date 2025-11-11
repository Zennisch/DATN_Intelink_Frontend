import { useState, useCallback } from 'react';
import { ShortUrlService, type CreateShortUrlRequest, type SearchShortUrlRequest, type ShortUrlListResponse, type UpdateShortUrlRequest } from '../services/ShortUrlService';

export const useShortUrl = () => {
	const [shortUrls, setShortUrls] = useState<ShortUrlListResponse[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const fetchShortUrls = useCallback(async (search: SearchShortUrlRequest) => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.searchShortUrls(search);
			setShortUrls(response.content);
			setTotalElements(response.totalElements);
			setTotalPages(response.totalPages);
			return response;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to fetch short URLs');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const createShortUrl = useCallback(async (request: CreateShortUrlRequest) => {
		try {
			setLoading(true);
			setError(null);
			const response = await ShortUrlService.createShortUrl(request);
			return response;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to create short URL');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateShortUrl = useCallback(async (shortCode: string, request: UpdateShortUrlRequest) => {
		try {
			setLoading(true);
			setError(null);
			await ShortUrlService.updateShortUrl(shortCode, request);
			return true;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to update short URL');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const deleteShortUrl = useCallback(async (shortCode: string) => {
		try {
			setLoading(true);
			setError(null);
			await ShortUrlService.deleteShortUrl(shortCode);
			return true;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to delete short URL');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const enableShortUrl = useCallback(async (shortCode: string) => {
		try {
			setLoading(true);
			setError(null);
			await ShortUrlService.enableShortUrl(shortCode);
			return true;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to enable short URL');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const disableShortUrl = useCallback(async (shortCode: string) => {
		try {
			setLoading(true);
			setError(null);
			await ShortUrlService.disableShortUrl(shortCode);
			return true;
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to disable short URL');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);


	return {
		shortUrls,
		totalElements,
		totalPages,
		loading,
		error,
		clearError,
		fetchShortUrls,
		createShortUrl,
		updateShortUrl,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
	};
};
