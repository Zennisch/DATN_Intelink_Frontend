export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface ResetPasswordRequest {
	password: string;
	confirmPassword: string;
}

export interface ForgotPasswordRequest {
	email: string;
}
