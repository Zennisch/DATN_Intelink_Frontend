import { DimensionType } from '../types/enums.ts';
import type { ShortUrl } from './index.ts';

export interface DimensionStat {
	// Key group
	id: string;

	// Many-to-one relationships
	shortUrl?: ShortUrl;

	// Stat group
	type: DimensionType;
	value: string;
	totalClicks: number;
}
