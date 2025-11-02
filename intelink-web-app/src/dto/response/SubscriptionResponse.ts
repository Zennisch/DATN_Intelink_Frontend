import { SubscriptionPlanType, SubscriptionStatus } from '../../types/enums.ts';

export interface SubscriptionResponse {
  // Subscription info
  id: string;
  status: SubscriptionStatus;
  active: boolean;
  createdAt: string;
  startsAt: string;
  expiresAt?: string;

  // Plan info
  planId: number;
  planType: SubscriptionPlanType;
  planDescription?: string;
  planPrice: number;
  maxShortUrls: number;
  shortCodeCustomizationEnabled: boolean;
  statisticsEnabled: boolean;
  customDomainEnabled: boolean;
  apiAccessEnabled: boolean;
}

export interface GetAllSubscriptionsResponse {
  subscriptions: SubscriptionResponse[];
  total: number;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  subscriptionId: string;
}
