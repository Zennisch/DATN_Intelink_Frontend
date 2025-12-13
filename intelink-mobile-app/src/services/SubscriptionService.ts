import api from './AxiosConfig';
import type { RegisterSubscriptionRequest } from '../dto/request/SubscriptionRequest';
import type {
	SubscriptionResponse,
	GetAllSubscriptionsResponse,
	CancelSubscriptionResponse,
	SubscriptionCostResponse
} from '../dto/response/SubscriptionResponse';

export class SubscriptionService {
	static async getAll(): Promise<GetAllSubscriptionsResponse> {
		console.log('🔍 [SubscriptionService] Fetching all subscriptions...');
		const response = await api.get<GetAllSubscriptionsResponse>('/api/v1/subscription');
		console.log('🔍 [SubscriptionService] All subscriptions response:', JSON.stringify(response.data, null, 2));
		return response.data;
	}

	static async getCurrent(): Promise<SubscriptionResponse> {
		console.log('🔍 [SubscriptionService] Fetching current subscription...');
		const response = await api.get<SubscriptionResponse>('/api/v1/subscription/current');
		console.log('🔍 [SubscriptionService] Current subscription response:', JSON.stringify(response.data, null, 2));
		return response.data;
	}

	static async register(request: RegisterSubscriptionRequest): Promise<{ subscriptionId: string; paymentUrl: string }> {
		const response = await api.post<{ subscriptionId: string; paymentUrl: string }>('/api/v1/subscription', request);
		return response.data;
	}

	static async cancel(id: string): Promise<CancelSubscriptionResponse> {
		const response = await api.post<CancelSubscriptionResponse>(`/api/v1/subscription/${id}/cancel`);
		return response.data;
	}

	static async getCost(subscriptionPlanId: number, applyImmediately: boolean = false): Promise<SubscriptionCostResponse> {
		const response = await api.get<SubscriptionCostResponse>('/api/v1/subscription/cost', {
			params: { subscriptionPlanId, applyImmediately }
		});
		return response.data;
	}
}
