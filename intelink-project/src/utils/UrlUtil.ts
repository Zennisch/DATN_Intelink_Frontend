/**
 * Utility functions for URL processing
 */

/**
 * Fix short URL format by removing {shortCode}/ pattern
 * Converts "http://localhost:8080/{shortCode}/uc3Tl39rSh" to "http://localhost:8080/uc3Tl39rSh"
 */
export const fixShortUrlFormat = (shortUrl: string): string => {
	if (!shortUrl) return "";
	// Remove {shortCode}/ pattern from the URL
	return shortUrl.replace(/{shortCode}\//, "");
};

/**
 * Validate if a URL is properly formatted
 */
export const isValidUrl = (url: string): boolean => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

/**
 * Extract short code from URL
 */
export const extractShortCode = (shortUrl: string): string => {
	try {
		const url = new URL(fixShortUrlFormat(shortUrl));
		const pathSegments = url.pathname
			.split("/")
			.filter((segment) => segment.length > 0);
		return pathSegments[pathSegments.length - 1] || "";
	} catch {
		return "";
	}
};
