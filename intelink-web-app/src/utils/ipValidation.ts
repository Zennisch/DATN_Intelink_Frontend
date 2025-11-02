import cidrRegex from 'cidr-regex';

/**
 * Validates if a string is a valid IPv4 address
 */
export const isValidIPv4 = (ip: string): boolean => {
	const parts = ip.split('.');
	if (parts.length !== 4) return false;

	return parts.every((part) => {
		const num = parseInt(part, 10);
		return num >= 0 && num <= 255 && part === num.toString();
	});
};

/**
 * Validates if a string is a valid CIDR notation
 */
export const isValidCIDR = (cidr: string): boolean => {
	return cidrRegex.v4({exact: true}).test(cidr);
};

/**
 * Validates if a string is either a valid IP or CIDR
 */
export const validateIPOrCIDR = (value: string): boolean => {
	if (!value.trim()) return true; // Empty is ok

	return isValidIPv4(value) || isValidCIDR(value);
};

/**
 * Get validation error message for IP/CIDR input
 */
export const getIPValidationError = (value: string): string | undefined => {
	if (!value.trim()) return undefined;

	if (!validateIPOrCIDR(value)) {
		return 'Invalid IP or CIDR format. Examples: 192.168.1.1 or 192.168.1.0/24';
	}

	return undefined;
};

/**
 * Calculate approximate number of IPs in a CIDR range
 */
export const calculateCIDRSize = (cidr: string): number => {
	if (!isValidCIDR(cidr)) return 0;

	const [, mask] = cidr.split('/');
	const maskBits = parseInt(mask, 10);

	// 2^(32 - mask) gives total IPs in range
	return Math.pow(2, 32 - maskBits);
};

/**
 * Format CIDR size for display
 */
export const formatCIDRSize = (cidr: string): string => {
	const size = calculateCIDRSize(cidr);
	if (size === 0) return '';
	if (size === 1) return '1 IP';
	if (size < 1000) return `${size} IPs`;
	if (size < 1000000) return `${(size / 1000).toFixed(1)}K IPs`;
	return `${(size / 1000000).toFixed(1)}M IPs`;
};
