import { UserRole, UserProvider, UserStatus } from '../types/enums.ts';

interface SubscriptionInfo {
	subscriptionId: string;
	planType: string;
	planDescription: string;
	status: string;
	active: boolean;
	startsAt: string;
	expiresAt: string;
	maxShortUrls: number;
	shortCodeCustomizationEnabled: boolean;
	statisticsEnabled: boolean;
	customDomainEnabled: boolean;
	apiAccessEnabled: boolean;
}

export interface User {
	// Key group
	id: number;

	// Auth group
	username: string;
	email: string;
	passwordHash?: string;
	emailVerified: boolean;
	lastLoginAt?: string;
	role: UserRole;
	provider: UserProvider;
	providerUserId?: string;

	// Information group
	displayName?: string;
	bio?: string;
	profilePictureUrl?: string;

	// Payment group
	creditBalance: number;
	currency: string;

	// Statistics group
	totalShortUrls: number;
	totalClicks: number;

	// Subscription group
	currentSubscription?: SubscriptionInfo;

	// Audit group
	status: UserStatus;
	createdAt: string;
	updatedAt: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
