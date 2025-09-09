import type { User } from './index';

export interface ApiKey {
	// Key group
	id: string;

	// Many-to-one relationships
	user?: User;

	// Information group
	name: string;
	keyHash: string;
	keyPrefix: string;

	// Configuration group
	rateLimitPerHour: number;
	active: boolean;
	expiresAt?: string;

	// Audit group
	createdAt: string;
	updatedAt: string;
	lastUsedAt?: string;
}
