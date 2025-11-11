import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export class AuthStorage {
	static async setAccessToken(token: string): Promise<void> {
		try {
			await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
		} catch (error) {
			console.error('Error saving access token:', error);
		}
	}

	static async getAccessToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		} catch (error) {
			console.error('Error getting access token:', error);
			return null;
		}
	}

	static async setRefreshToken(token: string): Promise<void> {
		try {
			await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
		} catch (error) {
			console.error('Error saving refresh token:', error);
		}
	}

	static async getRefreshToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error('Error getting refresh token:', error);
			return null;
		}
	}

	static async clearTokens(): Promise<void> {
		try {
			await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
		} catch (error) {
			console.error('Error clearing tokens:', error);
		}
	}

	static async hasTokens(): Promise<boolean> {
		try {
			const [access, refresh] = await Promise.all([
				AsyncStorage.getItem(ACCESS_TOKEN_KEY),
				AsyncStorage.getItem(REFRESH_TOKEN_KEY),
			]);
			return Boolean(access && refresh);
		} catch (error) {
			console.error('Error checking tokens:', error);
			return false;
		}
	}
}
