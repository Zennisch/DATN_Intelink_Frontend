export interface LoginResponse {
	token: string;
	refreshToken: string;
	username: string;
	email: string;
	role: "USER" | "ADMIN";
	expiresIn: number;
}

export interface LogoutResponse {
	success: boolean;
	message: string;
}
