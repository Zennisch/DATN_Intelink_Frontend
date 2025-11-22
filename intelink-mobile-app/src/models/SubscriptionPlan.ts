export enum SubscriptionPlanType {
	FREE = "FREE",
	BASIC = "BASIC",
	PRO = "PRO",
	ENTERPRISE = "ENTERPRISE"
}

export enum SubscriptionPlanBillingInterval {
	MONTHLY = "MONTHLY",
	QUARTERLY = "QUARTERLY",
	YEARLY = "YEARLY"
}

export interface SubscriptionPlan {
	// Key group
	id: number;

	// Details group
	type: SubscriptionPlanType;
	description?: string;
	price: number;
	billingInterval: SubscriptionPlanBillingInterval;

	// Features group
	maxShortUrls: number;
	shortCodeCustomizationEnabled: boolean;
	statisticsEnabled: boolean;
	customDomainEnabled: boolean;
	apiAccessEnabled: boolean;

	// Audit group
	active: boolean;
	createdAt: string;
	maxUsagePerUrl: number;
}
