import type { Subscription } from '../../models/Subscription';

export interface SubscriptionResponse {
	success: boolean;
	message: string;
	subscription?: Subscription;
}

export interface GetAllSubscriptionsResponse {
	success: boolean;
	message: string;
	subscriptions: Subscription[];
}

export interface CancelSubscriptionResponse {
	success: boolean;
	message: string;
}

export interface SubscriptionCostResponse {
	subscriptionPlanId: number;
	planPrice: number;
	proRateValue: number;
	amountToPay: number;
	creditBalance: number;
	currency: string;
	startDate: string;
	message: string;
}
