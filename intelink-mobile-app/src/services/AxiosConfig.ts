import axios from 'axios';
import { AuthStorage } from '../storages/AuthStorage';
import { BACKEND_URL } from '../types/environment';

// Create axios instance
const api = axios.create({
	baseURL: BACKEND_URL,
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
	async (config) => {
		const url = config.url || '';
		const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh') || url.includes('/auth/forgot-password') || url.includes('/auth/verify-email');

		if (!isAuthEndpoint) {
			const token = await AuthStorage.getAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = await AuthStorage.getRefreshToken();
				if (refreshToken) {
					const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {}, {
						headers: {
							Authorization: `Bearer ${refreshToken}`,
						},
					});

					const { token, refreshToken: newRefreshToken } = response.data;
					if (token) await AuthStorage.setAccessToken(token);
					if (newRefreshToken) await AuthStorage.setRefreshToken(newRefreshToken);

					// Retry original request
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				}
			} catch (refreshError) {
				// Refresh failed, clear tokens and redirect to login
				try { await AuthStorage.clearTokens(); } catch {}
				console.error('Token refresh failed:', refreshError);
			}
		}
		if (error.response?.status === 403) {
			console.warn('Access forbidden for', originalRequest?.url);
		}
		return Promise.reject(error);
	}
);

export default api;
