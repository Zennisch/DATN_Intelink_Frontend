import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { LoadingPage } from "./ui";

interface RouteGuardProps {
	children: React.ReactNode;
	requireAuth?: boolean;
	redirectTo?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
	children,
	requireAuth = false,
	redirectTo,
}) => {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (requireAuth && !isAuthenticated) {
				router.replace(redirectTo || "/(auth)/login");
			} else if (!requireAuth && isAuthenticated) {
				router.replace(redirectTo || "/(main)/dashboard");
			}
		}
	}, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

	if (isLoading) {
		return <LoadingPage />;
	}

	if (requireAuth && !isAuthenticated) {
		return <LoadingPage message="Redirecting to login..." />;
	}

	if (!requireAuth && isAuthenticated) {
		return <LoadingPage message="Redirecting to dashboard..." />;
	}

	return <>{children}</>;
};
