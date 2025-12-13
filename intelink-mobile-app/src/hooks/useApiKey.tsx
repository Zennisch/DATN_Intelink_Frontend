import { useState, useCallback } from 'react';
import { ApiKeyService } from '../services/ApiKeyService';
import type { ApiKeyResponse, CreateApiKeyRequest } from '../dto/ApiKeyDTO';

export const useApiKey = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchApiKeys = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ApiKeyService.getApiKeys();
            setApiKeys(data);
        } catch (err) {
            console.error('Failed to fetch API keys:', err);
            setError('Failed to load API keys');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createApiKey = async (request: CreateApiKeyRequest): Promise<ApiKeyResponse> => {
        setIsLoading(true);
        setError(null);
        try {
            const newKey = await ApiKeyService.createApiKey(request);
            await fetchApiKeys(); // Refresh list
            return newKey;
        } catch (err) {
            console.error('Failed to create API key:', err);
            setError('Failed to create API key');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteApiKey = async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await ApiKeyService.deleteApiKey(id);
            setApiKeys(prev => prev.filter(key => key.id !== id));
        } catch (err) {
            console.error('Failed to delete API key:', err);
            setError('Failed to delete API key');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        apiKeys,
        isLoading,
        error,
        fetchApiKeys,
        createApiKey,
        deleteApiKey
    };
};
