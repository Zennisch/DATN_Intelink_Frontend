import { SubscriptionPlanType, SubscriptionStatus } from '../../types/enums';

export interface SubscriptionInfo {
	// Subscription details
	subscriptionId: string;
	planType: SubscriptionPlanType;
	planDescription?: string;
	status: SubscriptionStatus;
	active: boolean;
	startsAt: string;
	expiresAt: string;

	// Plan features
	maxShortUrls: number;
	shortCodeCustomizationEnabled: boolean;
	statisticsEnabled: boolean;
	customDomainEnabled: boolean;
	apiAccessEnabled: boolean;
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: string;
	expiresAt: number;
}

export interface RegisterResponse {
	success: boolean;
	message: string;
	email: string;
	emailVerified: boolean;
}

export interface ResetPasswordResponse {
	success: boolean;
	message: string;
}

export interface VerifyEmailResponse {
	success: boolean;
	message: string;
}

export interface ForgotPasswordResponse {
	success: boolean;
	message: string;
}

export interface LogoutResponse {
	success: boolean;
	message: string;
}

export interface UserProfileResponse {
	// Basic user info
	id: number;
	username: string;
	email: string;
	role: string;
	status: string;
	
	// Profile info
	displayName?: string;
	bio?: string;
	profilePictureUrl?: string;
	
	// Auth info
	emailVerified: boolean;
	authProvider: string;
	providerUserId?: string;
	lastLoginAt?: string;
	
	// Payment
	creditBalance: number;
	currency: string;

	// Statistics
	totalClicks: number;
	totalShortUrls: number;

	// Current subscription info
	currentSubscription?: SubscriptionInfo;

	// Audit
	createdAt: string;
	updatedAt: string;
}
