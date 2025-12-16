export interface SubscriptionPlanResponse {
  id: number;
  type: string;
  description?: string;
  price: number;
  billingInterval: string;
  maxShortUrls: number;
  shortCodeCustomizationEnabled: boolean;
  statisticsEnabled: boolean;
  customDomainEnabled: boolean;
  apiAccessEnabled: boolean;
  active: boolean;
  createdAt: string;
  maxUsagePerUrl: number;
}

export interface GetAllSubscriptionPlansResponse {
  plans: SubscriptionPlanResponse[];
  total: number;
}

export interface DeleteSubscriptionPlanResponse {
  success: boolean;
  message: string;
}
