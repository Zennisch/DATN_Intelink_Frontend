import axios from 'axios';
import type {
	SubscriptionPlanRequest,
	SubscriptionPlanResponse,
	CreateSubscriptionRequest,
	SubscriptionResponse,
	CalculateCostRequest,
	CalculateCostResponse,
} from '../dto/SubscriptionDTO';

export class SubscriptionService {
	// ==================== Subscription Plan Endpoints ====================

	/**
	 * Get all subscription plans
	 */
	static async getAllPlans(): Promise<SubscriptionPlanResponse[]> {
		const response = await axios.get<SubscriptionPlanResponse[]>('/subscription-plans');
		return response.data;
	}

	/**
	 * Get subscription plan by ID
	 */
	static async getPlanById(id: number): Promise<SubscriptionPlanResponse> {
		const response = await axios.get<SubscriptionPlanResponse>(`/subscription-plans/${id}`);
		return response.data;
	}

	/**
	 * Create a new subscription plan (Admin only)
	 */
	static async createPlan(request: SubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
		const response = await axios.post<SubscriptionPlanResponse>('/subscription-plans', request);
		return response.data;
	}

	/**
	 * Update a subscription plan (Admin only)
	 */
	static async updatePlan(id: number, request: SubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
		const response = await axios.put<SubscriptionPlanResponse>(`/subscription-plans/${id}`, request);
		return response.data;
	}

	/**
	 * Delete a subscription plan (Admin only)
	 */
	static async deletePlan(id: number): Promise<void> {
		await axios.delete(`/subscription-plans/${id}`);
	}

	/**
	 * Toggle subscription plan active status (Admin only)
	 */
	static async togglePlanStatus(id: number): Promise<SubscriptionPlanResponse> {
		const response = await axios.put<SubscriptionPlanResponse>(`/subscription-plans/${id}/toggle-status`);
		return response.data;
	}

	// ==================== Subscription Endpoints ====================

	/**
	 * Get current user's active subscription
	 */
	static async getActiveSubscription(): Promise<SubscriptionResponse> {
		const response = await axios.get<SubscriptionResponse>('/subscriptions/active');
		return response.data;
	}

	/**
	 * Get all subscriptions of current user
	 */
	static async getAllSubscriptions(): Promise<SubscriptionResponse[]> {
		const response = await axios.get<SubscriptionResponse[]>('/subscriptions');
		return response.data;
	}

	/**
	 * Get subscription by ID
	 */
	static async getSubscriptionById(id: string): Promise<SubscriptionResponse> {
		const response = await axios.get<SubscriptionResponse>(`/subscriptions/${id}`);
		return response.data;
	}

	/**
	 * Create a new pending subscription
	 */
	static async createSubscription(request: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
		const response = await axios.post<SubscriptionResponse>('/subscriptions', request);
		return response.data;
	}

	/**
	 * Cancel an active subscription
	 */
	static async cancelSubscription(id: string): Promise<SubscriptionResponse> {
		const response = await axios.delete<SubscriptionResponse>(`/subscriptions/${id}`);
		return response.data;
	}

	/**
	 * Calculate subscription cost with pro-rated credit
	 */
	static async calculateCost(request: CalculateCostRequest): Promise<CalculateCostResponse> {
		const response = await axios.post<CalculateCostResponse>('/subscriptions/calculate-cost', request);
		return response.data;
	}
}
