import axios from 'axios';
import type { LoginRequest, LoginResponse, User } from '../models/User';

export class AuthService {
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		try {
			const response = await axios.post<LoginResponse>('/auth/login', credentials);
			return response.data;
		} catch (error) {
			console.error('Login failed:', error);
			throw error;
		}
	}

	static async getProfile(): Promise<User> {
		try {
			const response = await axios.get<User>('/auth/profile');
			return response.data;
		} catch (error) {
			console.error('Get profile failed:', error);
			throw error;
		}
	}

	static async refreshToken(refreshToken: string): Promise<LoginResponse> {
		try {
			const response = await axios.post<LoginResponse>('/auth/refresh', {
				token: refreshToken
			});
			return response.data;
		} catch (error) {
			console.error('Refresh token failed:', error);
			throw error;
		}
	}

	static async logout(): Promise<void> {
		try {
			await axios.post('/auth/logout');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	static async validateToken(): Promise<boolean> {
		try {
			await axios.get('/auth/validate');
			return true;
		} catch (error) {
			return false;
		}
	}
}
