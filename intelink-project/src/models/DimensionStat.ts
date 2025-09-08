import { DimensionType } from '../types/enums';
import type { ShortUrl } from './index';

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
