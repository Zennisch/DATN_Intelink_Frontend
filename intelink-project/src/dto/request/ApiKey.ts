export interface CreateApiKeyRequest {
    name: string;
    rateLimitPerHour: number;
    active: boolean;
}