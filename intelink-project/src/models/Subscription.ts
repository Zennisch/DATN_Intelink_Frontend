import { SubscriptionStatus } from '../types/enums.ts';
import type { User, SubscriptionPlan, Payment } from './index.ts';

export interface Subscription {
	// Key group
	id: string;

	// Many-to-one relationships
	user?: User;
	subscriptionPlan?: SubscriptionPlan;

	// One-to-one relationships
	payment?: Payment;

	// Status group
	status: SubscriptionStatus;
	active: boolean;
	creditUsed: number;
	proRateValue?: number;

	// Audit group
	createdAt: string;
	startsAt: string;
	activatedAt?: string;
	expiresAt?: string;
}
