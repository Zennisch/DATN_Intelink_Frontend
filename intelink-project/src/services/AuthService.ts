import axios from "axios";
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
} from "../dto/request/UserRequest.ts";
import type {
	LoginResponse,
	RegisterResponse,
	ResetPasswordResponse,
	LogoutResponse,
	UserProfileResponse,
} from "../dto/response/UserResponse.ts";

export class AuthService {
	static async register(
		credentials: RegisterRequest,
	): Promise<RegisterResponse> {
		const response = await axios.post<RegisterResponse>(
			"/auth/register",
			credentials,
		);
		return response.data;
	}

	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await axios.post<LoginResponse>(
			"/auth/login",
			credentials,
		);
		return response.data;
	}

	static async refresh(refreshToken: string): Promise<LoginResponse> {
		const response = await axios.post<LoginResponse>(
			"/auth/refresh",
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
		const response = await axios.get<UserProfileResponse>("/auth/profile");
		return response.data;
	}

	static async logout(): Promise<LogoutResponse> {
		const response = await axios.post<LogoutResponse>("/auth/logout");
		return response.data;
	}

	static async resetPassword(
		token: string,
		request: ResetPasswordRequest,
	): Promise<ResetPasswordResponse> {
		const response = await axios.post<ResetPasswordResponse>(
			`/auth/reset-password?token=${token}`,
			request,
		);
		return response.data;
	}

	static async oAuthCallback(token: string): Promise<LoginResponse> {
		const response = await axios.get<LoginResponse>(
			`/auth/oauth/callback?token=${token}`,
		);
		return response.data;
	}
}
