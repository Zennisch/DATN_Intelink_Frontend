import { VerificationTokenType } from '../types/enums.ts';
import type { User } from './index.ts';

export interface VerificationToken {
	// Key group
	id: string;

	// Many-to-one relationships
	user?: User;

	// Configuration group
	token: string;
	type: VerificationTokenType;
	used: boolean;
	expiresAt: string;

	// Audit group
	createdAt: string;
}
