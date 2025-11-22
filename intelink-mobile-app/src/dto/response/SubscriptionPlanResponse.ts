import type { SubscriptionPlan } from '../../models/SubscriptionPlan';

export interface SubscriptionPlanResponse {
	success: boolean;
	message: string;
	plan?: SubscriptionPlan;
}

export interface GetAllSubscriptionPlansResponse {
	success: boolean;
	message: string;
	plans: SubscriptionPlan[];
}

export interface DeleteSubscriptionPlanResponse {
	success: boolean;
	message: string;
}
