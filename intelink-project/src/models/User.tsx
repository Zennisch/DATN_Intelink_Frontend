export interface User {
	id: number;
	username: string;
	email: string;
	role: 'USER' | 'ADMIN';
	totalClicks: number;
	totalShortUrls: number;
	createdAt: string;
	updatedAt: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: 'USER' | 'ADMIN';
	expiresIn: number;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}