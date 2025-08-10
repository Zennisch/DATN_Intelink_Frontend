import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface AxiosNavigationContextType {
	navigateToLogin: () => void;
}

const AxiosNavigationContext = createContext<AxiosNavigationContextType | undefined>(undefined);

interface AxiosNavigationProviderProps {
	children: ReactNode;
}

export const AxiosNavigationProvider: React.FC<AxiosNavigationProviderProps> = ({ children }) => {
	const navigate = useNavigate();

	const navigateToLogin = () => {
		navigate('/login', { replace: true });
	};

	const value = {
		navigateToLogin
	};

	return (
		<AxiosNavigationContext.Provider value={value}>
			{children}
		</AxiosNavigationContext.Provider>
	);
};

export const useAxiosNavigation = (): AxiosNavigationContextType => {
	const context = useContext(AxiosNavigationContext);
	if (context === undefined) {
		throw new Error('useAxiosNavigation must be used within an AxiosNavigationProvider');
	}
	return context;
};

// Global navigation function for axios interceptor
let globalNavigateToLogin: (() => void) | null = null;

export const setGlobalNavigateToLogin = (navigateFunction: () => void) => {
	globalNavigateToLogin = navigateFunction;
};

export const getGlobalNavigateToLogin = () => globalNavigateToLogin;
