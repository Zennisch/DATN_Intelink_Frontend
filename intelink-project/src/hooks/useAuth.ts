import { createContext, useContext } from "react";
import type {
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
	ForgotPasswordRequest,
} from "../dto/request/UserRequest.ts";
import type {
	RegisterResponse,
	ResetPasswordResponse,
	VerifyEmailResponse,
	ForgotPasswordResponse,
} from "../dto/response/UserResponse.ts";
import type { AuthState } from "../models/User.ts";

export interface AuthContextType extends AuthState {
	login: (credentials: LoginRequest) => Promise<void>;
	logout: (onLogoutComplete?: () => void) => Promise<void>;
	refreshUser: () => Promise<void>;
	register: (credentials: RegisterRequest) => Promise<RegisterResponse>;
	resetPassword: (
		token: string,
		request: ResetPasswordRequest,
	) => Promise<ResetPasswordResponse>;
	oAuthCallback: (token: string) => Promise<void>;
	verifyEmail: (token: string) => Promise<VerifyEmailResponse>;
	forgotPassword: (
		request: ForgotPasswordRequest,
	) => Promise<ForgotPasswordResponse>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
