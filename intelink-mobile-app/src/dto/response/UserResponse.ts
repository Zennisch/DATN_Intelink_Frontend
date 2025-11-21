export interface LoginResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: string;
}

export interface RegisterResponse {
	message: string;
	success: boolean;
	email: string;
	emailVerified: boolean;
}

export interface ResetPasswordResponse {
	message: string;
	success: boolean;
}

export interface LogoutResponse {
	message: string;
	success: boolean;
}

export interface UserProfileResponse {
	id: number;
	username: string;
	email: string;
	role: string;
	authProvider: string;
	emailVerified: boolean;
	totalClicks: number;
	totalShortUrls: number;
	status: string;
	lastLoginAt?: string;
	createdAt: string;
	updatedAt: string;
	displayName?: string;
	bio?: string;
	profilePictureUrl?: string;
	providerUserId?: string;
	currentSubscription?: any;
	creditBalance: number;
	currency: string;
}

export interface VerifyEmailResponse {
	message: string;
	success: boolean;
}

export interface ForgotPasswordResponse {
	message: string;
	success: boolean;
}
