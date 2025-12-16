import axios from "axios";
import { AuthStorage } from "../storages/AuthStorage.ts";
import { Platform } from "react-native";

const getApi = () => {
	if (Platform.OS === 'web') {
		return '/api/v1';
	}
	const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://api.intelink.click';
	console.log("Backend URL:", backendUrl);
	console.log("Full API URL:", `${backendUrl}/api/v1`);
	return `${backendUrl}/api/v1`;
};

const API_URL = getApi();
const TIMEOUT = 30000;

export const setupAxios = async () => {
	axios.defaults.baseURL = API_URL;
	axios.defaults.headers.common["Content-Type"] = "application/json";
	axios.defaults.headers.common["Accept"] = "application/json";
	axios.defaults.withCredentials = true;
	axios.defaults.timeout = TIMEOUT;

	axios.interceptors.request.use(
		async (config) => {
			console.log(
				`[Axios Request]: ${config.method?.toUpperCase()} ${config.url}`,
			);

			// Skip adding token for auth endpoints
			const isAuthEndpoint = config.url?.includes('/auth/login') || 
								 config.url?.includes('/auth/register') ||
								 config.url?.includes('/auth/refresh');

			if (!isAuthEndpoint) {
				const accessToken = await AuthStorage.getAccessToken();
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}
			}

			return config;
		},
		(error) => {
			console.error(`[Axios Request Error]: ${error}`);
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(
		(response) => {
			console.log(
				`[Axios Response]: ${response.status} ${response.config.url}`,
			);
			return response;
		},
		(error) => {
			console.log(
				`[Axios Response Error]: ${error.response?.status} ${error.config?.url} - Message: ${error.message}`,
			);

			const originalRequest = error.config;

			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				const refreshToken = AuthStorage.getRefreshToken();
				if (refreshToken) {
					return axios
						.post(
							`${API_URL}/auth/refresh`,
							{},
							{
								headers: {
									Authorization: `Bearer ${refreshToken}`,
								},
							},
						)
						.then((response) => {
							AuthStorage.setAccessToken(response.data.token);
							originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
							return axios(originalRequest);
						})
						.catch((refreshError) => {
							console.error(`[Axios Refresh Token Error]: ${refreshError}`);
							AuthStorage.clearTokens();

							window.location.href = "/login";

							return Promise.reject(refreshError);
						});
				}
			}
			return Promise.reject(error);
		},
	);
};
