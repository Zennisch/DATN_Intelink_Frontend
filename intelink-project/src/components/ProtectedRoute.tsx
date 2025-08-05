import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
	children: ReactNode;
	fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
	children, 
	fallback = <div>Redirecting to login...</div> 
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		window.location.href = '/login';
		return <>{fallback}</>;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
