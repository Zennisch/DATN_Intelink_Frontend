import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthenticatedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

/**
 * Component để bảo vệ các route không được truy cập khi đã đăng nhập
 * Ví dụ: LoginPage, RegisterPage
 */
export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
	children,
	redirectTo = "/dashboard",
}) => {
	const { isAuthenticated, isLoading } = useAuth();

	// Hiển thị loading khi đang kiểm tra auth state
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// Nếu đã authenticate, redirect đến trang dashboard
	if (isAuthenticated) {
		return <Navigate to={redirectTo} replace />;
	}

	// Nếu chưa authenticate, hiển thị children (login page)
	return <>{children}</>;
};

export default AuthenticatedRoute;
