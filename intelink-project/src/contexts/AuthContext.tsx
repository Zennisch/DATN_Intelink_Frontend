import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { AuthStorage } from "../storages/AuthStorage";
import { AuthService } from "../services/AuthService";
import type { AuthState } from "../models/User.ts";
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
} from "../dto/request/UserRequest.ts";
import type {
	RegisterResponse,
	ResetPasswordResponse,
} from "../dto/response/UserResponse.ts";
import { AuthContext, type AuthContextType } from "../hooks/useAuth.ts";

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
					role: userData.role as "USER" | "ADMIN",
					totalClicks: userData.totalClicks,
					totalShortUrls: userData.totalShortUrls,
					emailVerified: userData.emailVerified,
					authProvider: userData.authProvider,
					lastLoginAt: userData.lastLoginAt,
					createdAt: userData.createdAt,
					updatedAt: userData.updatedAt,
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

			setAuthState((prev) => ({
				...prev,
				user: {
					id: 0,
					username,
					email,
					role,
					totalClicks: 0,
					totalShortUrls: 0,
					emailVerified: false,
					authProvider: "LOCAL",
					lastLoginAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
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

			setAuthState((prev) => ({
				...prev,
				user: {
					id: 0,
					username,
					email,
					role,
					totalClicks: 0,
					totalShortUrls: 0,
					emailVerified: false,
					authProvider: "OAUTH",
					lastLoginAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
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
	};

	const value: AuthContextType = {
		...authState,
		login,
		logout,
		refreshUser,
		register,
		resetPassword,
		oAuthCallback,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
