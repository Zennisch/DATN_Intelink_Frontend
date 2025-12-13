import type { PaymentProvider, PaymentStatus } from "../models/Payment";

// Billing Info
export interface BillingInfo {
  ip?: string;
  mobile?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  country?: string;
}

// Payment Request/Response DTOs
export interface CreateVNPayPaymentRequest {
  subscriptionId: string;
  amount: number;
  currency: string;
  billingInfo?: BillingInfo;
}

export interface CreateVNPayPaymentResponse {
  code: string;
  message: string;
  paymentUrl: string;
}

export interface PaymentResponse {
  id: string;
  subscriptionId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  processedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}
