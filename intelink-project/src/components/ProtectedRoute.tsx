import type { ReactNode } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	fallback = <div>Redirecting to login...</div>,
}) => {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return fallback;
	}

	if (!isAuthenticated) {
		navigate("/login", { replace: true });
	}

	return <>{children}</>;
};

export default ProtectedRoute;
