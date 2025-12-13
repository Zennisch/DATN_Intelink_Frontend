import type { User } from '../models/User';
import { SubscriptionPlanType } from '../models/SubscriptionPlan';

/**
 * Check if user can create more short URLs based on their subscription plan
 */
export const canCreateShortUrl = (user: User | null): { allowed: boolean; reason?: string } => {
	if (!user) {
		return { allowed: false, reason: 'User not authenticated' };
	}

	const currentSubscription = user.currentSubscription;
	if (!currentSubscription) {
		return { allowed: false, reason: 'No active subscription' };
	}

	const maxUrls = currentSubscription.maxShortUrls;
	const currentUrls = user.totalShortUrls || 0;

	if (maxUrls !== -1 && currentUrls >= maxUrls) {
		return { 
			allowed: false, 
			reason: `You have reached the limit of ${maxUrls} short URLs for your ${currentSubscription.planType} plan` 
		};
	}
	return { allowed: true };
};

/**
 * Check if user can customize short codes
 */
export const canCustomizeShortCode = (user: User | null): { allowed: boolean; reason?: string } => {
	if (!user) {
		return { allowed: false, reason: 'User not authenticated' };
	}

	const subscription = user.currentSubscription;
	if (!subscription) {
		return { allowed: false, reason: 'No active subscription' };
	}

	if (!subscription.shortCodeCustomizationEnabled) {
		return { 
			allowed: false, 
			reason: `Custom short codes are not available in ${subscription.planType} plan. Upgrade to use this feature.` 
		};
	}

	return { allowed: true };
};

/**
 * Check if user can access statistics
 */
export const canAccessStatistics = (user: User | null): { allowed: boolean; reason?: string } => {
	if (!user) {
		return { allowed: false, reason: 'User not authenticated' };
	}

	const subscription = user.currentSubscription;
	if (!subscription) {
		return { allowed: false, reason: 'No active subscription' };
	}

	if (!subscription.statisticsEnabled) {
		return { 
			allowed: false, 
			reason: `Statistics are not available in ${subscription.planType} plan. Upgrade to use this feature.` 
		};
	}
	return { allowed: true };
};

/**
 * Check if user can use custom domain
 */
export const canUseCustomDomain = (user: User | null): { allowed: boolean; reason?: string } => {
	if (!user) {
		return { allowed: false, reason: 'User not authenticated' };
	}

	const subscription = user.currentSubscription;
	if (!subscription) {
		return { allowed: false, reason: 'No active subscription' };
	}

	if (!subscription.customDomainEnabled) {
		return { 
			allowed: false, 
			reason: `Custom domain is not available in ${subscription.planType} plan. Upgrade to use this feature.` 
		};
	}
	return { allowed: true };
};

/**
 * Check if user can access API
 */
export const canAccessAPI = (user: User | null): { allowed: boolean; reason?: string } => {
	if (!user) {
		return { allowed: false, reason: 'User not authenticated' };
	}

	const subscription = user.currentSubscription;
	if (!subscription) {
		return { allowed: false, reason: 'No active subscription' };
	}

	if (!subscription.apiAccessEnabled) {
		return { 
			allowed: false, 
			reason: `API access is not available in ${subscription.planType} plan. Upgrade to use this feature.` 
		};
	}
	return { allowed: true };
};

/**
 * Get subscription plan display name
 */
export const getSubscriptionPlanDisplayName = (planType: SubscriptionPlanType | undefined): string => {
	if (!planType) return 'No Plan';
	
	const displayNames: Record<SubscriptionPlanType, string> = {
		[SubscriptionPlanType.FREE]: 'Free',
		[SubscriptionPlanType.BASIC]: 'Basic',
		[SubscriptionPlanType.PRO]: 'Pro',
		[SubscriptionPlanType.ENTERPRISE]: 'Enterprise',
	};

	return displayNames[planType] || planType;
};

/**
 * Check if user is on free plan
 */
export const isFreePlan = (user: User | null): boolean => {
	if (!user || !user.currentSubscription) {
		return true;
	}
	return user.currentSubscription.planType === 'FREE' || user.currentSubscription.planType === SubscriptionPlanType.FREE;
};
