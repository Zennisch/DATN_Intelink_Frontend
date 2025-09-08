import { UserProvider } from '../types/enums';
import type { User } from './index';

export interface OAuthAccount {
	// Key group
	id: string;

	// Many-to-one relationships
	user?: User;

	// Information group
	provider: UserProvider;
	providerUserId: string;
	providerUsername?: string;
	providerEmail?: string;
	accessToken?: string;
	refreshToken?: string;
	tokenExpiresAt?: string;

	// Audit group
	createdAt: string;
	updatedAt: string;
}
