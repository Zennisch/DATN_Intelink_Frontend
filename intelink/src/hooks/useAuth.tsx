import {createContext, useContext, useEffect, useState, useCallback, type ReactNode} from 'react';
import type {
	AuthInfoResponse,
	ForgotPasswordRequest,
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
	ResetPasswordRequest,
	UpdateProfileRequest,
	UpdatePasswordRequest,
	UserProfileResponse,
} from '../dto/UserDTO';
import type {User} from '../models/User';
import {AuthService} from '../services/AuthService.ts';
import {AuthStorage} from '../storages/AuthStorage';

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

export interface AuthContextType extends AuthState {
	register: (credentials: RegisterRequest) => Promise<RegisterResponse>;
	verifyEmail: (token: string) => Promise<AuthInfoResponse>;
	forgotPassword: (request: ForgotPasswordRequest) => Promise<AuthInfoResponse>;
	resetPassword: (token: string, request: ResetPasswordRequest) => Promise<AuthInfoResponse>;
	login: (credentials: LoginRequest) => Promise<void>;
	refreshUser: () => Promise<void>;
	logout: (onLogoutComplete?: () => void) => Promise<void>;
	oAuthCallback: (authToken: string, refreshToken?: string) => Promise<void>;
	updateProfile: (request: UpdateProfileRequest) => Promise<UserProfileResponse>;
	updatePassword: (request: UpdatePasswordRequest) => Promise<AuthInfoResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
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
				console.error('Failed to initialize auth:', error);
				AuthStorage.clearTokens();
			} finally {
				if (isMounted) {
					setAuthState((prev) => ({...prev, isLoading: false}));
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
			const profileResponse = await AuthService.getProfile();
			setAuthState((prev) => ({
				...prev,
				isAuthenticated: true,
				user: {
					id: profileResponse.id,
					username: profileResponse.username,
					email: profileResponse.email,
					verified: profileResponse.verified,
					role: profileResponse.role,
					status: profileResponse.status,
					lastLoginAt: profileResponse.lastLoginAt,
					profileName: profileResponse.profileName,
					profilePictureUrl: profileResponse.profilePictureUrl,
					totalShortUrls: profileResponse.totalShortUrls,
					totalClicks: profileResponse.totalClicks,
					balance: profileResponse.balance,
					currency: profileResponse.currency,
					createdAt: profileResponse.createdAt,
					updatedAt: profileResponse.updatedAt,
					currentSubscription: profileResponse.currentSubscription,
				},
			}));
		} catch (error) {
			console.error('Failed to fetch user profile:', error);
			throw error;
		}
	}, []);

	const register = useCallback(async (credentials: RegisterRequest): Promise<RegisterResponse> => {
		try {
			const response = await AuthService.register(credentials);
			return response;
		} catch (error) {
			console.error('Failed to register:', error);
			throw error;
		}
	}, []);

	const verifyEmail = useCallback(async (token: string): Promise<AuthInfoResponse> => {
		try {
			const response = await AuthService.verifyEmail(token);
			return response;
		} catch (error) {
			console.error('Failed to verify email:', error);
			throw error;
		}
	}, []);

	const forgotPassword = useCallback(async (request: ForgotPasswordRequest): Promise<AuthInfoResponse> => {
		try {
			const response = await AuthService.forgotPassword(request);
			return response;
		} catch (error) {
			console.error('Failed to send forgot password request:', error);
			throw error;
		}
	}, []);

	const resetPassword = useCallback(async (token: string, request: ResetPasswordRequest): Promise<AuthInfoResponse> => {
		try {
			const response = await AuthService.resetPassword(token, request);
			return response;
		} catch (error) {
			console.error('Failed to reset password:', error);
			throw error;
		}
	}, []);

	const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
		try {
			setAuthState((prev) => ({...prev, isLoading: true}));
			const response = await AuthService.login(credentials);

			const {token, refreshToken} = response;

			AuthStorage.setAccessToken(token);
			AuthStorage.setRefreshToken(refreshToken);

			setAuthState((prev) => ({
				...prev,
				isAuthenticated: true,
				isLoading: false,
			}));
			await getProfile();
		} catch (error) {
			console.error('Failed to login:', error);
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
			console.error('Failed to logout:', error);
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
			console.error('Failed to refresh user:', error);
			await logout();
		}
	}, [getProfile, logout]);

	const oAuthCallback = useCallback(async (authToken: string, refreshToken?: string): Promise<void> => {
		try {
			setAuthState((prev) => ({...prev, isLoading: true}));
			// Direct token handling instead of calling backend callback again
			AuthStorage.setAccessToken(authToken);
			if (refreshToken) {
				AuthStorage.setRefreshToken(refreshToken);
			}
			
			setAuthState((prev) => ({
				...prev,
				isAuthenticated: true,
				isLoading: false,
			}));
			await getProfile();
		} catch (error) {
			console.error('Failed to process OAuth callback:', error);
			setAuthState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			throw error;
		}
	}, [getProfile]);

	const updateProfile = useCallback(async (request: UpdateProfileRequest): Promise<UserProfileResponse> => {
		try {
			const response = await AuthService.updateProfile(request);
			setAuthState((prev) => ({
				...prev,
				user: prev.user ? { ...prev.user, ...response } : null,
			}));
			return response;
		} catch (error) {
			console.error('Failed to update profile:', error);
			throw error;
		}
	}, []);

	const updatePassword = useCallback(async (request: UpdatePasswordRequest): Promise<AuthInfoResponse> => {
		try {
			const response = await AuthService.updatePassword(request);
			return response;
		} catch (error) {
			console.error('Failed to update password:', error);
			throw error;
		}
	}, []);

	const value: AuthContextType = {
		...authState,
		register,
		verifyEmail,
		forgotPassword,
		resetPassword,
		login,
		refreshUser,
		logout,
		oAuthCallback,
		updateProfile,
		updatePassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}