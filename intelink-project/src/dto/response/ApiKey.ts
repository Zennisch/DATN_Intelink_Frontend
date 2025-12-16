export interface ApiKeyResponse {
    id: string;
    name: string;
    rawKey?: string;
    keyPrefix: string;
    rateLimitPerHour: number;
    active: boolean;
    expiresAt?: string;
    createdAt: string;
    updatedAt: string;
    lastUsedAt?: string;
}