export interface LoginResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: "USER" | "ADMIN";
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
	id: number;
	username: string;
	email: string;
	role: string;
	totalClicks: number;
	totalShortUrls: number;
	emailVerified: boolean;
	authProvider: string;
	lastLoginAt: string;
	createdAt: string;
	updatedAt: string;
}
