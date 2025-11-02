export interface RegisterSubscriptionRequest {
  subscriptionPlanId: number;
  autoRenew?: boolean;
  applyImmediately?: boolean;
}
