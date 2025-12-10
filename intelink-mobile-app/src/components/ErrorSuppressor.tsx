import React from 'react';
import { View } from 'react-native';

/**
 * ErrorSuppressor - Wraps children and catches any errors during render
 * Used to prevent NativeWind navigation context errors from crashing the app
 */
interface ErrorSuppressorProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export class ErrorSuppressor extends React.Component<ErrorSuppressorProps, { hasError: boolean }> {
	constructor(props: ErrorSuppressorProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		// Check if it's a navigation context error
		if (error?.message?.includes('navigation context') ||
		    error?.message?.includes('NavigationContainer') ||
		    error?.message?.includes('get__getKey')) {
			console.warn('[ErrorSuppressor] Caught and suppressed navigation context error');
			return { hasError: false }; // Pretend no error happened
		}
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Only log non-navigation errors
		if (!error?.message?.includes('navigation context')) {
			console.error('[ErrorSuppressor] Caught error:', error, errorInfo);
		}
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback || <View />;
		}

		return this.props.children;
	}
}
