import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AuthenticatedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

/**
 * Component to protect routes that should not be accessed when already logged in
 * Example: LoginPage, RegisterPage
 */
export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
	children,
	redirectTo = "/dashboard",
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	// Show loading when checking auth state
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// If already authenticated, redirect to dashboard page
	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	// If not authenticated, show children (login page)
	return <>{children}</>;
};

export default AuthenticatedRoute;
