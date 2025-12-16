import type { SubscriptionPlanType, SubscriptionPlanBillingInterval, SubscriptionStatus } from "../models/Subscription";

// Subscription Plan DTOs
export interface SubscriptionPlanRequest {
  type: SubscriptionPlanType;
  billingInterval: SubscriptionPlanBillingInterval;
  description?: string;
  price: number;
  maxShortUrls: number;
  maxUsagePerUrl: number;
  shortCodeCustomizationEnabled: boolean;
  statisticsEnabled: boolean;
  apiAccessEnabled: boolean;
}

export interface SubscriptionPlanResponse {
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

// Subscription DTOs
export interface CreateSubscriptionRequest {
  planId: number;
}

export interface SubscriptionResponse {
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
  planDetails?: SubscriptionPlanResponse;
}

// Cost Calculation DTOs
export interface CalculateCostRequest {
  planId: number;
}

export interface CalculateCostResponse {
  planId: number;
  planType: string;
  planPrice: number;
  durationDays: number;
  proratedCredit: number;
  currentPlanType?: string;
  currentExpiresAt?: string;
  finalCost: number;
  savings: number;
  message?: string;
}
