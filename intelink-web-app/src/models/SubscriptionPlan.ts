import {
	SubscriptionPlanBillingInterval,
	SubscriptionPlanType,
} from "../types/enums.ts";

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
