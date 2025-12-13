export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELED';
export type SubscriptionPlanType = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SubscriptionPlanBillingInterval = 'MONTHLY' | 'YEARLY' | 'LIFETIME';

export interface SubscriptionPlan {
  id: number;
  type: SubscriptionPlanType;
  billingInterval: SubscriptionPlanBillingInterval;
  active: boolean;
  description?: string;
  price: number;
  maxShortUrls: number;
  maxUsagePerUrl: number;
  shortCodeCustomizationEnabled: boolean;
  statisticsEnabled: boolean;
  apiAccessEnabled: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: number;
  planId: number;
  planType: string;
  status: SubscriptionStatus;
  active: boolean;
  creditUsed: number;
  proratedValue: number;
  activatedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
