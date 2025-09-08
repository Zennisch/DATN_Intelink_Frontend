import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PageSpinner } from "./ui";

interface AuthenticatedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
	children,
	redirectTo = "/dashboard",
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <PageSpinner />;
	}

	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
};

export default AuthenticatedRoute;
