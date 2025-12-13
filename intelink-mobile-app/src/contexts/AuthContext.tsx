import type { ReactNode } from "react";
import React, { createContext, useEffect, useState, useCallback } from "react";
import { AuthStorage } from "../storages/AuthStorage";
import { AuthService } from "../services/AuthService";
import type { AuthState } from "../models/User";
import { UserRole, UserProvider, UserStatus } from "../types/enums";
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	ForgotPasswordRequest,
	RegisterResponse,
	AuthInfoResponse,
} from "../dto/UserDTO";

export interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: (onLogoutComplete?: () => void) => Promise<void>;
	refreshUser: () => Promise<void>;
	register: (credentials: RegisterRequest) => Promise<RegisterResponse>;
	resetPassword: (
		token: string,
		request: ResetPasswordRequest,
	) => Promise<AuthInfoResponse>;
	oAuthLogin: (token: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<AuthInfoResponse>;
	forgotPassword: (
		request: ForgotPasswordRequest,
	) => Promise<AuthInfoResponse>;
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
				const hasTokens = await AuthStorage.hasTokens();
				if (hasTokens) await getProfile();
			} catch (error) {
				console.error("Failed to initialize auth:", error);
				// Clear tokens if profile fetch fails
				await AuthStorage.clearTokens();
				if (isMounted) {
					setAuthState({
						user: null,
						isAuthenticated: false,
						isLoading: false,
					});
				}
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

	const getProfile = useCallback(async (): Promise<void> => {
		try {
			const userData = await AuthService.getProfile();
			
			console.log('🔍 [AuthContext] Full user data from API:', JSON.stringify(userData, null, 2));
			console.log('🔍 [AuthContext] currentSubscription:', userData.currentSubscription);
			if (userData.currentSubscription) {
				console.log('🔍 [AuthContext] subscriptionPlan object:', userData.currentSubscription.subscriptionPlan);
				console.log('🔍 [AuthContext] planType:', userData.currentSubscription.subscriptionPlan?.planType);
			}

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
					currentSubscription: userData.currentSubscription,
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
	}, []);

	const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }));

			const loginResponse = await AuthService.login(credentials);
			const { token, refreshToken, username, email, role } = loginResponse;

			await AuthStorage.setAccessToken(token);
			await AuthStorage.setRefreshToken(refreshToken);

			setAuthState((prev) => ({
				...prev,
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
					currentSubscription: undefined,
				},
				isAuthenticated: true,
				isLoading: false,
			}));

			await getProfile();
		} catch (error) {
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			throw error;
		}
	}, [getProfile]);

	const logout = useCallback(async (onLogoutComplete?: () => void): Promise<void> => {
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
	}, []);

	const refreshUser = useCallback(async (): Promise<void> => {
		try {
			await getProfile();
		} catch (error) {
			console.error("Failed to refresh user:", error);
			await logout();
		}
	}, [getProfile, logout]);

	const register = useCallback(async (
		credentials: RegisterRequest,
	): Promise<RegisterResponse> => {
		try {
			console.log("🔐 AuthContext - Registering with credentials:", credentials);
			console.log("🔐 AuthContext - Credentials type check:", {
				username: typeof credentials.username,
				email: typeof credentials.email,
				password: typeof credentials.password,
				confirmPassword: (credentials as any).confirmPassword ? 'EXISTS - SHOULD NOT!' : 'undefined (correct)'
			});
			const response = await AuthService.register(credentials);
			return response;
		} catch (error) {
			console.error("Registration failed:", error);
			throw error;
		}
	}, []);

	const resetPassword = useCallback(async (
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
	}, []);

	const oAuthLogin = useCallback(async (token: string): Promise<void> => {
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

			await AuthStorage.setAccessToken(accessToken);
			await AuthStorage.setRefreshToken(refreshToken);

			setAuthState((prev) => ({
				...prev,
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
					currentSubscription: undefined,
				},
				isAuthenticated: true,
				isLoading: false,
			}));

			await getProfile();
		} catch (error) {
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			throw error;
		}
	}, [getProfile]);

	const verifyEmail = useCallback(async (token: string): Promise<VerifyEmailResponse> => {
		try {
			const response = await AuthService.verifyEmail(token);
			return response;
		} catch (error) {
			console.error("Email verification failed:", error);
			throw error;
		}
	}, []);

	const forgotPassword = useCallback(async (
		request: ForgotPasswordRequest,
	): Promise<ForgotPasswordResponse> => {
		try {
			const response = await AuthService.forgotPassword(request);
			return response;
		} catch (error) {
			console.error("Forgot password failed:", error);
			throw error;
		}
	}, []);

	const value: AuthContextType = {
		...authState,
		login,
		logout,
		refreshUser,
		register,
		resetPassword,
		oAuthLogin,
		verifyEmail,
		forgotPassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
