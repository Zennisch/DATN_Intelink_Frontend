import React, { createContext, useContext } from 'react';

/**
 * Mock Navigation Context for Modals
 * 
 * This provides a minimal navigation context to prevent NativeWind's CSS interop
 * from throwing errors when components are rendered inside React Native Modals.
 * 
 * Modals render outside the main navigation tree, so they don't have access to
 * the parent NavigationContainer's context. This mock context satisfies NativeWind's
 * requirement without actually providing navigation functionality.
 */

const MockNavigationContext = createContext<any>({
	getKey: () => 'modal-' + Math.random().toString(36).substr(2, 9),
	addListener: () => () => {},
	removeListener: () => {},
});

interface ModalNavigationProviderProps {
	children: React.ReactNode;
}

export const ModalNavigationProvider: React.FC<ModalNavigationProviderProps> = ({ children }) => {
	const mockNavigationValue = {
		getKey: () => 'modal-' + Math.random().toString(36).substr(2, 9),
		addListener: () => () => {},
		removeListener: () => {},
	};

	return (
		<MockNavigationContext.Provider value={mockNavigationValue}>
			{children}
		</MockNavigationContext.Provider>
	);
};

export const useMockNavigation = () => useContext(MockNavigationContext);
