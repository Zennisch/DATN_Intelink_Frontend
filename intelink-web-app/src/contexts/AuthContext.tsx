import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import { AuthStorage } from "../storages/AuthStorage.ts";
import { AuthService } from "../services/AuthService.ts";
import type { AuthState } from "../models/User.ts";
import { UserRole, UserProvider, UserStatus } from "../types/enums.ts";
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	ForgotPasswordRequest,
} from "../dto/request/UserRequest.ts";
import type {
	RegisterResponse,
	ResetPasswordResponse,
	VerifyEmailResponse,
	ForgotPasswordResponse,
} from "../dto/response/UserResponse.ts";

export interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: (onLogoutComplete?: () => void) => Promise<void>;
	refreshUser: () => Promise<void>;
	register: (credentials: RegisterRequest) => Promise<RegisterResponse>;
	resetPassword: (
		token: string,
		request: ResetPasswordRequest,
	) => Promise<ResetPasswordResponse>;
	oAuthCallback: (token: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
	forgotPassword: (
		request: ForgotPasswordRequest,
	) => Promise<ForgotPasswordResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	useEffect(() => {
		let isMounted = true;

		const initializeAuth = async () => {
			try {
				if (AuthStorage.isAuthenticated()) {
					await getProfile();
				}
			} catch (error) {
				console.error("Failed to initialize auth:", error);
				AuthStorage.clearTokens();
			} finally {
				if (isMounted) {
					setAuthState((prev) => ({ ...prev, isLoading: false }));
				}
			}
		};

		initializeAuth();

		return () => {
			isMounted = false;
		};
	}, []);

	const getProfile = async (): Promise<void> => {
		try {
			const userData = await AuthService.getProfile();

			setAuthState((prev) => ({
				...prev,
				user: {
					id: userData.id,
					username: userData.username,
					email: userData.email,
					role: userData.role as UserRole,
					provider: userData.authProvider as UserProvider,
					emailVerified: userData.emailVerified,
					totalClicks: userData.totalClicks,
					totalShortUrls: userData.totalShortUrls,
					status: userData.status as UserStatus,
					lastLoginAt: userData.lastLoginAt,
					createdAt: userData.createdAt,
					updatedAt: userData.updatedAt,
					displayName: userData.displayName,
					bio: userData.bio,
					profilePictureUrl: userData.profilePictureUrl,
					providerUserId: userData.providerUserId,
					currentSubscription: userData.currentSubscription || undefined,
					creditBalance: userData.creditBalance,
					currency: userData.currency,
				},
				isAuthenticated: true,
				isLoading: false,
			}));
		} catch (error) {
			console.error("Failed to fetch user profile:", error);
			throw error;
		}
	};

	const login = async (credentials: LoginRequest): Promise<void> => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }));

			const loginResponse = await AuthService.login(credentials);
			const { token, refreshToken, username, email, role } = loginResponse;

			AuthStorage.setAccessToken(token);
			AuthStorage.setRefreshToken(refreshToken);

			setAuthState({
				user: {
					id: 0,
					username,
					email,
					role: role as UserRole,
					provider: UserProvider.LOCAL,
					totalClicks: 0,
					totalShortUrls: 0,
					emailVerified: false,
					status: UserStatus.ACTIVE,
					lastLoginAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					creditBalance: 0,
					currency: "VND",
				},
				isAuthenticated: true,
				isLoading: false,
			});

			await getProfile();
		} catch (error) {
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			throw error;
		}
	};

	const logout = async (onLogoutComplete?: () => void): Promise<void> => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error("Logout API call failed:", error);
		} finally {
			AuthStorage.clearTokens();
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});

			if (onLogoutComplete) {
				onLogoutComplete();
			}
		}
	};

	const refreshUser = async (): Promise<void> => {
		try {
			await getProfile();
		} catch (error) {
			console.error("Failed to refresh user:", error);
			await logout();
		}
	};

	const register = async (
		credentials: RegisterRequest,
	): Promise<RegisterResponse> => {
		try {
			const response = await AuthService.register(credentials);
			return response;
		} catch (error) {
			console.error("Registration failed:", error);
			throw error;
		}
	};

	const resetPassword = async (
		token: string,
		request: ResetPasswordRequest,
	): Promise<ResetPasswordResponse> => {
		try {
			const response = await AuthService.resetPassword(token, request);
			return response;
		} catch (error) {
			console.error("Reset password failed:", error);
			throw error;
		}
	};

	const oAuthCallback = async (token: string): Promise<void> => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }));

			const loginResponse = await AuthService.oAuthCallback(token);
			const {
				token: accessToken,
				refreshToken,
				username,
				email,
				role,
			} = loginResponse;

			AuthStorage.setAccessToken(accessToken);
			AuthStorage.setRefreshToken(refreshToken);

			setAuthState({
				user: {
					id: 0,
					username,
					email,
					role: role as UserRole,
					provider: UserProvider.GOOGLE,
					totalClicks: 0,
					totalShortUrls: 0,
					emailVerified: false,
					status: UserStatus.ACTIVE,
					lastLoginAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					creditBalance: 0,
					currency: "VND",
				},
				isAuthenticated: true,
				isLoading: false,
			});

			await getProfile();
		} catch (error) {
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			throw error;
		}
	};

	const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
		try {
			const response = await AuthService.verifyEmail(token);
			return response;
		} catch (error) {
			console.error("Email verification failed:", error);
			throw error;
		}
	};

	const forgotPassword = async (
		request: ForgotPasswordRequest,
	): Promise<ForgotPasswordResponse> => {
		try {
			const response = await AuthService.forgotPassword(request);
			return response;
		} catch (error) {
			console.error("Forgot password failed:", error);
			throw error;
		}
	};

	const value: AuthContextType = {
		...authState,
		login,
		logout,
		refreshUser,
		register,
		resetPassword,
		oAuthCallback,
		verifyEmail,
		forgotPassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
