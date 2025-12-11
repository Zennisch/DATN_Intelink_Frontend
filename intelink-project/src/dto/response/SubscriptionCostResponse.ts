export interface SubscriptionCostResponse {
  subscriptionPlanId: number;
  planPrice: number;
  proRateValue: number;
  amountToPay: number;
  creditBalance: number;
	requiresPayment: boolean;
  currency: string;
  message: string;
  startDate: string;
}
