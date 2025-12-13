import axios from "axios";
import type { ApiKeyResponse, CreateApiKeyRequest } from "../dto/ApiKeyDTO";

export const ApiKeyService = {
    getApiKeys: async (): Promise<ApiKeyResponse[]> => {
        const response = await axios.get<ApiKeyResponse[]>('/api-keys');
        return response.data;
    },

    createApiKey: async (request: CreateApiKeyRequest): Promise<ApiKeyResponse> => {
        const response = await axios.post<ApiKeyResponse>('/api-keys', request);
        return response.data;
    },

    deleteApiKey: async (id: string): Promise<void> => {
        await axios.delete(`/api-keys/${id}`);
    }
};
