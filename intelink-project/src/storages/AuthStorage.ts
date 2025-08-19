const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN";

const tokenCache: {
	accessToken: string | null;
	refreshToken: string | null;
} = {
	accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
	refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
};

export const AuthStorage = {
	getAccessToken: () => {
		return tokenCache.accessToken;
	},
	getRefreshToken: () => {
		return tokenCache.refreshToken;
	},
	setAccessToken: (token: string) => {
		tokenCache.accessToken = token;
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
	},
	setRefreshToken: (token: string) => {
		tokenCache.refreshToken = token;
		localStorage.setItem(REFRESH_TOKEN_KEY, token);
	},
	clearTokens: () => {
		tokenCache.accessToken = null;
		tokenCache.refreshToken = null;
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	},
	hasTokens: () => {
		return !!(tokenCache.accessToken && tokenCache.refreshToken);
	},
	isAuthenticated: () => {
		return !!tokenCache.accessToken;
	},
};
