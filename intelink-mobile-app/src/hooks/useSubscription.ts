import { useState, useCallback } from 'react';
import { SubscriptionService } from '../services/SubscriptionService';
import { SubscriptionPlanService } from '../services/SubscriptionPlanService';
import type { Subscription } from '../models/Subscription';
import type { SubscriptionPlan } from '../models/SubscriptionPlan';
import type { SubscriptionCostResponse } from '../dto/response/SubscriptionResponse';

export const useSubscription = () => {
	const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
	const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [costInfo, setCostInfo] = useState<SubscriptionCostResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchCurrentSubscription = useCallback(async () => {
		try {
			console.log('🔍 [useSubscription] fetchCurrentSubscription called');
			setLoading(true);
			setError(null);
			const response = await SubscriptionService.getCurrent();
			console.log('🔍 [useSubscription] Current subscription response:', response);
			if (response.success && response.subscription) {
				console.log('🔍 [useSubscription] Setting current subscription:', response.subscription);
				setCurrentSubscription(response.subscription);
			} else {
				console.warn('🔍 [useSubscription] No subscription in response or not successful:', response);
			}
		} catch (err: any) {
			console.error('❌ [useSubscription] Error fetching current subscription:', err);
			console.error('❌ [useSubscription] Error response:', err.response?.data);
			setError(err.response?.data?.message || 'Failed to fetch current subscription');
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchAllSubscriptions = useCallback(async () => {
		try {
			console.log('🔍 [useSubscription] fetchAllSubscriptions called');
			setLoading(true);
			setError(null);
			const response = await SubscriptionService.getAll();
			console.log('🔍 [useSubscription] All subscriptions response:', response);
			if (response.success) {
				console.log('🔍 [useSubscription] Setting subscriptions:', response.subscriptions?.length || 0, 'items');
				setAllSubscriptions(response.subscriptions);
			} else {
				console.warn('🔍 [useSubscription] Response not successful:', response);
			}
		} catch (err: any) {
			console.error('❌ [useSubscription] Error fetching subscriptions:', err);
			console.error('❌ [useSubscription] Error response:', err.response?.data);
			setError(err.response?.data?.message || 'Failed to fetch subscriptions');
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchPlans = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			console.log('[useSubscription] Fetching plans...');
			const response = await SubscriptionPlanService.getAll();
			console.log('[useSubscription] Plans response:', JSON.stringify(response, null, 2));
			console.log('[useSubscription] Response type:', typeof response);
			console.log('[useSubscription] Is array?', Array.isArray(response));
			
			// Handle both response formats:
			// 1. Backend returns { success, message, plans: [...] }
			// 2. Backend returns [...] directly
			if (Array.isArray(response)) {
				console.log('[useSubscription] Response is array, setting plans directly:', response.length);
				setPlans(response);
			} else if (response && typeof response === 'object' && 'plans' in response) {
				console.log('[useSubscription] Response has plans property:', response.plans?.length);
				setPlans(response.plans || []);
			} else {
				console.error('[useSubscription] Unexpected response format:', response);
				setError('Unexpected response format from server');
			}
		} catch (err: any) {
			console.error('[useSubscription] Error fetching plans:', err);
			console.error('[useSubscription] Error response:', err.response?.data);
			setError(err.response?.data?.message || 'Failed to fetch subscription plans');
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCost = useCallback(async (planId: number, applyImmediately: boolean = false) => {
		try {
			setLoading(true);
			setError(null);
			const response = await SubscriptionService.getCost(planId, applyImmediately);
			setCostInfo(response);
			return response;
		} catch (err: any) {
			console.error('Error fetching cost:', err);
			setError(err.response?.data?.message || 'Failed to fetch cost information');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const registerSubscription = useCallback(async (planId: number, applyImmediately: boolean = false) => {
		try {
			setLoading(true);
			setError(null);
			const response = await SubscriptionService.register({
				subscriptionPlanId: planId,
				applyImmediately
			});
			return response;
		} catch (err: any) {
			console.error('Error registering subscription:', err);
			setError(err.response?.data?.message || 'Failed to register subscription');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const cancelSubscription = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);
			const response = await SubscriptionService.cancel(id);
			if (response.success) {
				await fetchCurrentSubscription();
			}
			return response;
		} catch (err: any) {
			console.error('Error cancelling subscription:', err);
			setError(err.response?.data?.message || 'Failed to cancel subscription');
			throw err;
		} finally {
			setLoading(false);
		}
	}, [fetchCurrentSubscription]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		currentSubscription,
		allSubscriptions,
		plans,
		costInfo,
		loading,
		error,
		fetchCurrentSubscription,
		fetchAllSubscriptions,
		fetchPlans,
		fetchCost,
		registerSubscription,
		cancelSubscription,
		clearError
	};
};
