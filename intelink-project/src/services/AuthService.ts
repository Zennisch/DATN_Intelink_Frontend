import axios from "axios";
import type { User } from "../models/User.ts";
import type {
	LoginRequest,
	RegisterRequest,
} from "../dto/request/UserRequest.ts";
import type { LoginResponse } from "../dto/response/UserResponse.ts";

export class AuthService {
	static async register(credentials: RegisterRequest): Promise<LoginResponse> {
		try {
			const response = await axios.post<LoginResponse>(
				"/auth/register",
				credentials,
			);
			return response.data;
		} catch (error) {
			console.error("Register failed:", error);
			throw error;
		}
	}

	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await axios.post<LoginResponse>(
				"/auth/login",
				credentials,
			);
			return response.data;
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	}

	static async refresh(refreshToken: string): Promise<LoginResponse> {
		try {
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
		} catch (error) {
			console.error("Refresh token failed:", error);
			throw error;
		}
	}

	static async getProfile(): Promise<User> {
		try {
			const response = await axios.get<User>("/auth/profile");
			return response.data;
		} catch (error) {
			console.error("Get profile failed:", error);
			throw error;
		}
	}

	static async logout(): Promise<void> {
		try {
			await axios.post("/auth/logout");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	}

	static async oAuthCallback(token: string): Promise<LoginResponse> {
		try {
			const response = await axios.get<LoginResponse>(
				`/auth/oauth/callback?token=${token}`,
			);
			return response.data;
		} catch (error) {
			console.error("OAuth2 callback failed:", error);
			throw error;
		}
	}
}
