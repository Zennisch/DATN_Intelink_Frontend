import api from './AxiosConfig';
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	ForgotPasswordRequest,
} from "../dto/request/UserRequest";
import type {
	LoginResponse,
	RegisterResponse,
	ResetPasswordResponse,
	LogoutResponse,
	UserProfileResponse,
	VerifyEmailResponse,
	ForgotPasswordResponse,
} from "../dto/response/UserResponse";

export class AuthService {
	static async register(
		credentials: RegisterRequest,
	): Promise<RegisterResponse> {
		const response = await api.post<RegisterResponse>(
			"/api/v1/auth/register",
			credentials,
		);
		return response.data;
	}

	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await api.post<LoginResponse>(
			"/api/v1/auth/login",
			credentials,
		);
		return response.data;
	}

	static async refresh(refreshToken: string): Promise<LoginResponse> {
		const response = await api.post<LoginResponse>(
			"/api/v1/auth/refresh",
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			},
		);
		return response.data;
	}

	static async getProfile(): Promise<UserProfileResponse> {
		const response = await api.get<UserProfileResponse>("/api/v1/auth/profile");
		console.log("User profile response:", response.data);
		return response.data;
	}

	static async logout(): Promise<LogoutResponse> {
		const response = await api.post<LogoutResponse>("/api/v1/auth/logout");
		return response.data;
	}

	static async resetPassword(
		token: string,
		request: ResetPasswordRequest,
	): Promise<ResetPasswordResponse> {
		const response = await api.post<ResetPasswordResponse>(
			`/api/v1/auth/reset-password?token=${token}`,
			request,
		);
		return response.data;
	}

	static async oAuthCallback(token: string): Promise<LoginResponse> {
		const response = await api.get<LoginResponse>(
			`/api/v1/auth/oauth/callback?token=${token}`,
		);
		return response.data;
	}

	static async verifyEmail(token: string): Promise<VerifyEmailResponse> {
		const response = await api.post<VerifyEmailResponse>(
			`/api/v1/auth/verify-email?token=${token}`,
		);
		return response.data;
	}

	static async forgotPassword(
		request: ForgotPasswordRequest,
	): Promise<ForgotPasswordResponse> {
		const response = await api.post<ForgotPasswordResponse>(
			"/api/v1/auth/forgot-password",
			request,
		);
		return response.data;
	}
}
