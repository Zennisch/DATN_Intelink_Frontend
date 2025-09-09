import { ShortUrlStatus } from '../types/enums';
import type { User, CustomDomain } from './index';

export interface ShortUrl {
	// Key group
	id: number;

	// Many-to-one relationships
	user?: User;
	customDomain?: CustomDomain;

	// Information group
	shortCode: string;
	originalUrl: string;
	passwordHash?: string;
	alias?: string;
	description?: string;

	// Stat group
	status: ShortUrlStatus;
	maxUsage?: number;
	totalClicks: number;

	// Audit group
	createdAt: string;
	updatedAt: string;
	expiresAt?: string;
	deletedAt?: string;
}
