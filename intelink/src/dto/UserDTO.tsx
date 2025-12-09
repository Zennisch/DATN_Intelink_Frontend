import type { UserRole, UserStatus } from "../models/User";

// Requests
export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	password: string;
	confirmPassword: string;
}

// Responses
export interface AuthTokenResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: string;
	expiresAt: number;
}

export interface AuthInfoResponse {
	success: boolean;
	message: string;
}

export interface RegisterResponse {
	success: boolean;
	message: string;
	email: string;
	emailVerified: boolean;
}

export interface UserProfileResponse {
  id: number;
  username: string;
  email: string;
  verified: boolean;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string;
  profileName?: string;
  profilePictureUrl?: string;
  totalShortUrls: number;
  totalClicks: number;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}