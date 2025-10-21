import { Platform } from 'react-native';

// Match web project's API path: `${BACKEND_URL}/api/v1`
// For web we use a relative path and rely on Metro dev-server proxy to avoid CORS.
// For native, use EXPO_PUBLIC_BACKEND_URL if provided, else fall back to Android emulator default host.
const NATIVE_BACKEND_HOST = process.env.EXPO_PUBLIC_BACKEND_URL ?? 'http://10.0.2.2:8080';
export const BACKEND_URL = Platform.OS === 'web' ? '' : `${NATIVE_BACKEND_HOST}`;
