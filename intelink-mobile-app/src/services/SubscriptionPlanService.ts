import api from './AxiosConfig';
import type {
	GetAllSubscriptionPlansResponse,
	SubscriptionPlanResponse
} from '../dto/response/SubscriptionPlanResponse';

export class SubscriptionPlanService {
	static async getAll(): Promise<GetAllSubscriptionPlansResponse> {
		const response = await api.get<GetAllSubscriptionPlansResponse>('/api/v1/plan');
		return response.data;
	}

	static async getById(id: number): Promise<SubscriptionPlanResponse> {
		const response = await api.get<SubscriptionPlanResponse>(`/api/v1/plan/${id}`);
		return response.data;
	}
}
