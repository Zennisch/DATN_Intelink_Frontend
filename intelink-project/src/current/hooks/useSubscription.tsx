import {createContext, useContext, useState, type ReactNode} from 'react';
import type {
	SubscriptionPlanRequest,
	SubscriptionPlanResponse,
	CreateSubscriptionRequest,
	SubscriptionResponse,
	CalculateCostRequest,
	CalculateCostResponse,
} from '../dto/SubscriptionDTO';
import {SubscriptionService} from '../services/SubscriptionService';

export interface SubscriptionState {
	isLoading: boolean;
	activeSubscription: SubscriptionResponse | null;
	subscriptions: SubscriptionResponse[];
	plans: SubscriptionPlanResponse[];
}

export interface SubscriptionContextType extends SubscriptionState {
	// Subscription Plan methods
	getAllPlans: () => Promise<SubscriptionPlanResponse[]>;
	getPlanById: (id: number) => Promise<SubscriptionPlanResponse>;
	createPlan: (request: SubscriptionPlanRequest) => Promise<SubscriptionPlanResponse>;
	updatePlan: (id: number, request: SubscriptionPlanRequest) => Promise<SubscriptionPlanResponse>;
	deletePlan: (id: number) => Promise<void>;
	togglePlanStatus: (id: number) => Promise<SubscriptionPlanResponse>;

	// Subscription methods
	getActiveSubscription: () => Promise<SubscriptionResponse | null>;
	getAllSubscriptions: () => Promise<SubscriptionResponse[]>;
	getSubscriptionById: (id: string) => Promise<SubscriptionResponse>;
	createSubscription: (request: CreateSubscriptionRequest) => Promise<SubscriptionResponse>;
	cancelSubscription: (id: string) => Promise<SubscriptionResponse>;
	calculateCost: (request: CalculateCostRequest) => Promise<CalculateCostResponse>;

	// State management
	refreshActiveSubscription: () => Promise<void>;
	refreshPlans: () => Promise<void>;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
	children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({children}) => {
	const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
		isLoading: false,
		activeSubscription: null,
		subscriptions: [],
		plans: [],
	});

	const setLoading = (isLoading: boolean) => {
		setSubscriptionState((prev) => ({...prev, isLoading}));
	};

	// ==================== Subscription Plan Methods ====================

	const getAllPlans = async (): Promise<SubscriptionPlanResponse[]> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.getAllPlans();
			setSubscriptionState((prev) => ({...prev, plans: response}));
			return response;
		} catch (error) {
			console.error('Failed to get subscription plans:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getPlanById = async (id: number): Promise<SubscriptionPlanResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.getPlanById(id);
			return response;
		} catch (error) {
			console.error('Failed to get subscription plan:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const createPlan = async (request: SubscriptionPlanRequest): Promise<SubscriptionPlanResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.createPlan(request);
			// Refresh plans list
			await getAllPlans();
			return response;
		} catch (error) {
			console.error('Failed to create subscription plan:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updatePlan = async (id: number, request: SubscriptionPlanRequest): Promise<SubscriptionPlanResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.updatePlan(id, request);
			// Refresh plans list
			await getAllPlans();
			return response;
		} catch (error) {
			console.error('Failed to update subscription plan:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deletePlan = async (id: number): Promise<void> => {
		try {
			setLoading(true);
			await SubscriptionService.deletePlan(id);
			// Refresh plans list
			await getAllPlans();
		} catch (error) {
			console.error('Failed to delete subscription plan:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const togglePlanStatus = async (id: number): Promise<SubscriptionPlanResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.togglePlanStatus(id);
			// Refresh plans list
			await getAllPlans();
			return response;
		} catch (error) {
			console.error('Failed to toggle plan status:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ==================== Subscription Methods ====================

	const getActiveSubscription = async (): Promise<SubscriptionResponse | null> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.getActiveSubscription();
			setSubscriptionState((prev) => ({...prev, activeSubscription: response}));
			return response;
		} catch (error: any) {
			// 404 is expected if no active subscription
			if (error.response?.status === 404) {
				setSubscriptionState((prev) => ({...prev, activeSubscription: null}));
				return null;
			}
			console.error('Failed to get active subscription:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getAllSubscriptions = async (): Promise<SubscriptionResponse[]> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.getAllSubscriptions();
			setSubscriptionState((prev) => ({...prev, subscriptions: response}));
			return response;
		} catch (error) {
			console.error('Failed to get subscriptions:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getSubscriptionById = async (id: string): Promise<SubscriptionResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.getSubscriptionById(id);
			return response;
		} catch (error) {
			console.error('Failed to get subscription:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const createSubscription = async (request: CreateSubscriptionRequest): Promise<SubscriptionResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.createSubscription(request);
			return response;
		} catch (error) {
			console.error('Failed to create subscription:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const cancelSubscription = async (id: string): Promise<SubscriptionResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.cancelSubscription(id);
			// Refresh active subscription
			await getActiveSubscription();
			return response;
		} catch (error) {
			console.error('Failed to cancel subscription:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const calculateCost = async (request: CalculateCostRequest): Promise<CalculateCostResponse> => {
		try {
			setLoading(true);
			const response = await SubscriptionService.calculateCost(request);
			return response;
		} catch (error) {
			console.error('Failed to calculate cost:', error);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	// ==================== Helper Methods ====================

	const refreshActiveSubscription = async (): Promise<void> => {
		await getActiveSubscription();
	};

	const refreshPlans = async (): Promise<void> => {
		await getAllPlans();
	};

	const value: SubscriptionContextType = {
		...subscriptionState,
		// Plan methods
		getAllPlans,
		getPlanById,
		createPlan,
		updatePlan,
		deletePlan,
		togglePlanStatus,
		// Subscription methods
		getActiveSubscription,
		getAllSubscriptions,
		getSubscriptionById,
		createSubscription,
		cancelSubscription,
		calculateCost,
		// Helpers
		refreshActiveSubscription,
		refreshPlans,
	};

	return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

export const useSubscription = (): SubscriptionContextType => {
	const context = useContext(SubscriptionContext);
	if (context === undefined) {
		throw new Error('useSubscription must be used within a SubscriptionProvider');
	}
	return context;
};
