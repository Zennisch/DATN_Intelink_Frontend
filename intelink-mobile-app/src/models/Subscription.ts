import type { SubscriptionPlan } from './SubscriptionPlan';

export enum SubscriptionStatus {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	EXPIRED = "EXPIRED",
	CANCELLED = "CANCELLED"
}

/**
 * Subscription model - matches MOBILE backend API flat structure
 * Backend returns properties directly, NOT nested in subscriptionPlan
 */
export interface Subscription {
	// IDs
	subscriptionId: string;
	
	// Plan details (FLAT - directly in subscription object from API)
	planType: string;
	planDescription: string;
	maxShortUrls: number;
	
	// Feature flags
	shortCodeCustomizationEnabled: boolean;
	statisticsEnabled: boolean;
	customDomainEnabled: boolean;
	apiAccessEnabled: boolean;
	
	// Status
	status: SubscriptionStatus | string;
	active: boolean;
	
	// Dates
	startsAt: string;
	expiresAt?: string;
}
