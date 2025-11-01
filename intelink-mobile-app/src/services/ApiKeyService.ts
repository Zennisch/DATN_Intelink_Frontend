import api from './AxiosConfig';

export interface ApiKey {
	id: string;
	name: string;
	keyPrefix: string;
	rawKey?: string;
	rateLimitPerHour: number;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateApiKeyRequest {
	name: string;
	rateLimitPerHour: number;
	active: boolean;
}

export type ApiKeyResponse = ApiKey;

export class ApiKeyService {
	static async list(): Promise<ApiKeyResponse[]> {
		const response = await api.get<ApiKeyResponse[]>('/api-keys');
		return response.data;
	}

	static async create(request: CreateApiKeyRequest): Promise<ApiKeyResponse> {
		const response = await api.post<ApiKeyResponse>('/api-keys', request);
		return response.data;
	}

	static async delete(id: string): Promise<{ success: boolean; message: string }> {
		const response = await api.delete<{ success: boolean; message: string }>(`/api-keys/${id}`);
		return response.data;
	}

	static async update(id: string, request: Partial<CreateApiKeyRequest>): Promise<ApiKeyResponse> {
		const response = await api.put<ApiKeyResponse>(`/api-keys/${id}`, request);
		return response.data;
	}
}
