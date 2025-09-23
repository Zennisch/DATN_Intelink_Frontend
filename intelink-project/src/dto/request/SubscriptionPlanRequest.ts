export interface CreateSubscriptionPlanRequest {
  type: string;
  description?: string;
  price: number;
  billingInterval: string;
  maxShortUrls: number;
  maxUsagePerUrl: number;
  shortCodeCustomizationEnabled?: boolean;
  statisticsEnabled?: boolean;
  customDomainEnabled?: boolean;
  apiAccessEnabled?: boolean;
  active?: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  type: string;
  description?: string;
  price: number;
  billingInterval: string;
  maxShortUrls: number;
  maxUsagePerUrl: number;
  shortCodeCustomizationEnabled?: boolean;
  statisticsEnabled?: boolean;
  customDomainEnabled?: boolean;
  apiAccessEnabled?: boolean;
  active?: boolean;
}
