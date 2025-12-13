export type PaymentProvider = 'VNPAY' | 'MOMO' | 'ZALOPAY';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELED' | 'EXPIRED';

export interface Payment {
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
