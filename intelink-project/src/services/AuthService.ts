import axios from 'axios';
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	ForgotPasswordRequest,
	AuthTokenResponse,
	AuthInfoResponse,
	RegisterResponse,
	UserProfileResponse,
} from '../dto/UserDTO';

export class AuthService {
	static async register(credentials: RegisterRequest): Promise<RegisterResponse> {
		const response = await axios.post<RegisterResponse>('/auth/register', credentials);
		return response.data;
	}

	static async verifyEmail(token: string): Promise<AuthInfoResponse> {
		const response = await axios.post<AuthInfoResponse>(`/auth/verify-email?token=${token}`);
		return response.data;
	}

	static async forgotPassword(request: ForgotPasswordRequest): Promise<AuthInfoResponse> {
		const response = await axios.post<AuthInfoResponse>('/auth/forgot-password', request);
		return response.data;
	}

	static async resetPassword(token: string, request: ResetPasswordRequest): Promise<AuthInfoResponse> {
		const response = await axios.post<AuthInfoResponse>(`/auth/reset-password?token=${token}`, request);
		return response.data;
	}

	static async login(credentials: LoginRequest): Promise<AuthTokenResponse> {
		const response = await axios.post<AuthTokenResponse>('/auth/login', credentials);
		return response.data;
	}

	static async refresh(refreshToken: string): Promise<AuthTokenResponse> {
		const response = await axios.post<AuthTokenResponse>(
			'/auth/refresh',
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		);
		return response.data;
	}

	static async logout(): Promise<AuthInfoResponse> {
		const response = await axios.post<AuthInfoResponse>('/auth/logout');
		return response.data;
	}

	static async getProfile(): Promise<UserProfileResponse> {
		const response = await axios.get<UserProfileResponse>('/auth/profile');
		console.log('User profile response:', response.data);
		return response.data;
	}

	static async oAuthCallback(token: string): Promise<AuthTokenResponse> {
		const response = await axios.get<AuthTokenResponse>(`/auth/oauth/callback?token=${token}`);
		return response.data;
	}
}
