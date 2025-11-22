import type { SubscriptionPlanType } from './SubscriptionPlan';

export enum SubscriptionStatus {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	EXPIRED = "EXPIRED",
	CANCELLED = "CANCELLED"
}

export interface Subscription {
	// Key group
	id: string;

	// Plan information (flat structure from backend)
	planId: number;
	planType: SubscriptionPlanType;
	planDescription?: string;
	planPrice: number;
	maxShortUrls: number;
	shortCodeCustomizationEnabled: boolean;
	statisticsEnabled: boolean;
	customDomainEnabled: boolean;
	apiAccessEnabled: boolean;

	// Status group
	status: SubscriptionStatus;
	active: boolean;
	creditUsed?: number;
	proRateValue?: number;

	// Audit group
	createdAt: string;
	startsAt: string;
	activatedAt?: string;
	expiresAt?: string;
}
