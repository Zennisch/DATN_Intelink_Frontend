import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthNavigation = () => {
	const navigate = useNavigate();
	const { logout: contextLogout } = useAuth();

	const logout = useCallback(async () => {
		await contextLogout(() => {
			navigate('/login', { replace: true });
		});
	}, [contextLogout, navigate]);

	const redirectToDashboard = useCallback(() => {
		navigate('/dashboard', { replace: true });
	}, [navigate]);

	const redirectToLogin = useCallback(() => {
		navigate('/login', { replace: true });
	}, [navigate]);

	return {
		logout,
		redirectToDashboard,
		redirectToLogin
	};
};
