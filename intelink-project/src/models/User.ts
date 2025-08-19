export interface User {
	id: number;
	username: string;
	email: string;
	role: "USER" | "ADMIN";
	totalClicks: number;
	totalShortUrls: number;
	emailVerified: boolean;
	authProvider: string;
	lastLoginAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
