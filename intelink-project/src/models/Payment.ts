import { PaymentProvider, PaymentStatus } from '../types/enums';
import type { Subscription } from './index';

export interface Payment {
	// Key group
	id: string;

	// One-to-one relationships
	subscription?: Subscription;

	// Details group
	provider: PaymentProvider;
	status: PaymentStatus;
	amount: number;
	currency: string;

	// Result group
	transactionId?: string;
	metadata?: string;

	// Audit group
	createdAt: string;
	updatedAt?: string;
	processedAt?: string;
	expiresAt?: string;
}
