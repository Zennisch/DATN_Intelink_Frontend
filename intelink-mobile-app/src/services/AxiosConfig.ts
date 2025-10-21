import axios from 'axios';
import { AuthStorage } from '../storages/AuthStorage';
import { BACKEND_URL } from '../types/environment';

// Create axios instance
if (__DEV__) {
	// Surface where the app thinks the backend is (native/web differ)
	console.log('[Axios] BACKEND_URL =', BACKEND_URL);
}
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
			if (__DEV__) console.log('[Axios] →', (config.baseURL || ''), config.url);
		const url = config.url || '';
		const isAuthEndpoint = url.includes('/api/v1/auth/login') || url.includes('/api/v1/auth/register') || url.includes('/api/v1/auth/refresh') || url.includes('/api/v1/auth/forgot-password') || url.includes('/api/v1/auth/verify-email');

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
			if (__DEV__) console.log('[Axios] ← error', {
				url: error?.config?.url,
				baseURL: error?.config?.baseURL,
				code: error?.code,
				status: error?.response?.status,
				message: error?.message,
			});
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = await AuthStorage.getRefreshToken();
				if (refreshToken) {
					const response = await axios.post(`${BACKEND_URL}/api/v1/auth/refresh`, {}, {
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
