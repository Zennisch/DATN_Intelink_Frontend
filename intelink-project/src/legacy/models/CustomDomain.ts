import { CustomDomainStatus, CustomDomainVerificationMethod } from '../types/enums.ts';
import type { User } from './index.ts';

export interface CustomDomain {
	// Key group
	id: string;

	// Many-to-one relationships
	user?: User;

	// Configuration group
	domain: string;
	subdomain?: string;
	status: CustomDomainStatus;
	verified: boolean;
	verificationMethod: CustomDomainVerificationMethod;
	sslEnabled: boolean;
	verificationToken: string;
	active: boolean;

	// Audit group
	createdAt: string;
	updatedAt: string;
}
