import { Granularity } from '../types/enums';
import type { ShortUrl } from './index';

export interface ClickStat {
	// Key group
	id: number;

	// Many-to-one relationships
	shortUrl?: ShortUrl;

	// Stat group
	granularity: Granularity;
	bucket: string;
	totalClicks: number;
}
