export interface ApiKeyResponse {
    id: string;
    name: string;
    keyPrefix: string;
    rawKey?: string; // Only returned on creation
    rateLimitPerHour: number;
    active: boolean;
    expiresAt?: string;
    createdAt: string;
    lastUsedAt?: string;
}

export interface CreateApiKeyRequest {
    name: string;
    rateLimitPerHour?: number;
    active?: boolean;
}
