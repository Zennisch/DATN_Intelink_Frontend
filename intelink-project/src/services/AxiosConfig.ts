import axios from "axios";
import { AuthStorage } from "../storages/AuthStorage";
import { getGlobalNavigateToLogin } from "../contexts/AxiosNavigationContext";

const getApi = () => {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	if (!backendUrl) {
		throw new Error(
			"VITE_BACKEND_URL is not defined in the environment variables.",
		);
	}
	return `${backendUrl}/api/v1`;
};

const API_URL = getApi();
const TIMEOUT = 10000;

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

			const accessToken = AuthStorage.getAccessToken();
			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
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
							
							// Use global navigation function instead of window.location.href
							const navigate = getGlobalNavigateToLogin();
							if (navigate) {
								navigate();
							} else {
								// Fallback to window.location if navigation context is not available
								window.location.href = "/login";
							}
							
							return Promise.reject(refreshError);
						});
				}
			}
			return Promise.reject(error);
		},
	);
};
