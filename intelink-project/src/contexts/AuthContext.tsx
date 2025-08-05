import type {ReactNode} from 'react';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {AuthStorage} from '../storage/AuthStorage';
import {AuthService} from '../services/AuthService';
import type {AuthState, LoginRequest, User} from '../models/User';

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        const initializeAuth = async () => {
            try {
                if (AuthStorage.isAuthenticated()) {
                    await fetchUserProfile();
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                AuthStorage.clearTokens();
            } finally {
                setAuthState((prev) => ({...prev, isLoading: false}));
            }
        };

        initializeAuth();
    }, []);

    const fetchUserProfile = async (): Promise<void> => {
        try {
            const userData = await AuthService.getProfile();

            setAuthState({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            throw error;
        }
    };

    const login = async (credentials: LoginRequest): Promise<void> => {
        try {
            setAuthState((prev) => ({...prev, isLoading: true}));

            const loginResponse = await AuthService.login(credentials);
            const {token, refreshToken, username, email, role} = loginResponse;

            AuthStorage.setAccessToken(token);
            AuthStorage.setRefreshToken(refreshToken);

            const user: User = {
                id: 0,
                username,
                email,
                role,
                totalClicks: 0,
                totalShortUrls: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });

            await fetchUserProfile();
        } catch (error) {
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            AuthStorage.clearTokens();
            setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });

            window.location.href = '/login';
        }
    };

    const refreshUser = async (): Promise<void> => {
        try {
            await fetchUserProfile();
        } catch (error) {
            console.error('Failed to refresh user:', error);
            logout();
        }
    };

    const value: AuthContextType = {
        ...authState,
        login,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
