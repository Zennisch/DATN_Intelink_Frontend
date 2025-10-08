import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import { PageSpinner } from "./ui";

interface RouteGuardProps {
	children: ReactNode;
	requireAuth?: boolean;
	redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
	children,
	requireAuth = false,
	redirectTo,
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <PageSpinner />;
	}

	if (requireAuth && !isAuthenticated) {
		return <Navigate to={redirectTo || "/login"} replace />;
	}

	if (!requireAuth && isAuthenticated) {
		return <Navigate to={redirectTo || "/dashboard"} replace />;
	}

	return <>{children}</>;
};

export default RouteGuard;
