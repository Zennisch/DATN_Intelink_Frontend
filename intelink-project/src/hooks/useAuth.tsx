import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import type {
	AuthInfoResponse,
	ForgotPasswordRequest,
	LoginRequest,
	RegisterRequest,
	RegisterResponse,
	ResetPasswordRequest,
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
	oAuthCallback: (authToken: string) => Promise<void>;
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

	const getProfile = async (): Promise<void> => {
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
	};

	const register = async (credentials: RegisterRequest): Promise<RegisterResponse> => {
		try {
			return await AuthService.register(credentials);
		} catch (error) {
			console.error('Registration failed:', error);
			throw error;
		}
	};

	const verifyEmail = async (token: string): Promise<AuthInfoResponse> => {
		try {
			return await AuthService.verifyEmail(token);
		} catch (error) {
			console.error('Email verification failed:', error);
			throw error;
		}
	};

	const forgotPassword = async (request: ForgotPasswordRequest): Promise<AuthInfoResponse> => {
		try {
			return await AuthService.forgotPassword(request);
		} catch (error) {
			console.error('Forgot password request failed:', error);
			throw error;
		}
	};

	const resetPassword = async (token: string, request: ResetPasswordRequest): Promise<AuthInfoResponse> => {
		try {
			return await AuthService.resetPassword(token, request);
		} catch (error) {
			console.error('Password reset failed:', error);
			throw error;
		}
	};

	const login = async (credentials: LoginRequest): Promise<void> => {
		try {
			const response = await AuthService.login(credentials);
			AuthStorage.setToken(response.token);
			AuthStorage.setRefreshToken(response.refreshToken);
			await getProfile();
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	};

	const refreshUser = async (): Promise<void> => {
		await getProfile();
	};

	const logout = async (onLogoutComplete?: () => void): Promise<void> => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error('Logout failed:', error);
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

	const oAuthCallback = async (authToken: string): Promise<void> => {
		try {
			const response = await AuthService.oAuthCallback(authToken);
			AuthStorage.setToken(response.token);
			AuthStorage.setRefreshToken(response.refreshToken);
			await getProfile();
		} catch (error) {
			console.error('OAuth callback failed:', error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				...authState,
				register,
				verifyEmail,
				forgotPassword,
				resetPassword,
				login,
				refreshUser,
				logout,
				oAuthCallback,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
