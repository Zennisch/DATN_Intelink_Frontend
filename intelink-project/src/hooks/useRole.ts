import { useAuth } from '../contexts/AuthContext';

export const useRole = () => {
	const { user, isAuthenticated } = useAuth();

	const hasRole = (role: 'USER' | 'ADMIN'): boolean => {
		return isAuthenticated && user?.role === role;
	};

	const isAdmin = (): boolean => {
		return hasRole('ADMIN');
	};

	const isUser = (): boolean => {
		return hasRole('USER');
	};

	const hasAnyRole = (roles: ('USER' | 'ADMIN')[]): boolean => {
		return isAuthenticated && user?.role ? roles.includes(user.role) : false;
	};

	return {
		hasRole,
		isAdmin,
		isUser,
		hasAnyRole,
		currentRole: user?.role || null,
	};
};

export default useRole;
