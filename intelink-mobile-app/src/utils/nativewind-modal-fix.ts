/**
 * NativeWind Modal Context Fix
 * 
 * Provides a global error handler to catch and suppress navigation context
 * errors that occur when NativeWind tries to access navigation from Modals.
 */

let isPatched = false;

export const setupNativeWindModalFix = () => {
	if (isPatched) return;
	isPatched = true;

	// Patch console.error to intercept React errors
	const originalConsoleError = console.error;
	console.error = (...args: any[]) => {
		const errorMessage = args[0]?.toString() || '';
		if (errorMessage.includes('navigation context') || 
		    errorMessage.includes('NavigationContainer') ||
		    errorMessage.includes('Have you wrapped your app')) {
			// Silently suppress
			return;
		}
		originalConsoleError(...args);
	};

	// Patch console.warn as well
	const originalConsoleWarn = console.warn;
	console.warn = (...args: any[]) => {
		const warnMessage = args[0]?.toString() || '';
		if (warnMessage.includes('navigation context') || 
		    warnMessage.includes('NavigationContainer')) {
			return;
		}
		originalConsoleWarn(...args);
	};

	// Intercept global error handler
	const originalErrorHandler = (global as any).ErrorUtils?.getGlobalHandler();
	
	(global as any).ErrorUtils?.setGlobalHandler((error: Error, isFatal: boolean) => {
		// Check if it's the navigation context error from NativeWind
		const errorMsg = error?.message || error?.toString() || '';
		if (errorMsg.includes('navigation context') || 
		    errorMsg.includes('NavigationContainer') ||
		    errorMsg.includes('Have you wrapped your app') ||
		    errorMsg.includes('get__getKey')) {
			// Silently suppress these errors
			return;
		}
		
		// Pass other errors to original handler
		if (originalErrorHandler) {
			originalErrorHandler(error, isFatal);
		} else {
			// Fallback: log to console if no handler
			console.error('Unhandled error:', error);
		}
	});

	console.log('[NativeWind Fix] Modal error suppression enabled');
};
