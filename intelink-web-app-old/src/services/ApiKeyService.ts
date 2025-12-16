import axios from "axios";
import type { CreateApiKeyRequest } from "../dto/request/ApiKey";
import type { ApiKeyResponse } from "../dto/response/ApiKey";

export class ApiKeyService {
	static async list(): Promise<ApiKeyResponse[]> {
		const response = await axios.get<ApiKeyResponse[]>("/api-keys");
		return response.data;
	}

	static async get(id: string): Promise<ApiKeyResponse | { success: boolean; message: string }> {
		const response = await axios.get(`/api-keys/${id}`);
		return response.data;
	}

	static async create(request: CreateApiKeyRequest): Promise<ApiKeyResponse> {
		const response = await axios.post<ApiKeyResponse>("/api-keys", request);
		return response.data;
	}

	static async update(id: string, request: CreateApiKeyRequest): Promise<ApiKeyResponse | { success: boolean; message: string }> {
		const response = await axios.put(`/api-keys/${id}`, request);
		return response.data;
	}

	static async delete(id: string): Promise<{ success: boolean; message: string }> {
		const response = await axios.delete(`/api-keys/${id}`);
		return response.data;
	}
}