import { IpVersion } from '../types/enums.ts';
import type { ShortUrl } from './index.ts';

export interface ClickLog {
	// Key group
	id: string;

	// Many-to-one relationships
	shortUrl?: ShortUrl;

	// Attribute group
	ipVersion: IpVersion;
	ipAddress: string;
	userAgent?: string;
	referrer?: string;

	// Audit group
	timestamp: string;
}
