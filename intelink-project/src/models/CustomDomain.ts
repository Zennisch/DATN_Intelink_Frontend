import { CustomDomainStatus, CustomDomainVerificationMethod } from '../types/enums';
import type { User } from './index';

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
