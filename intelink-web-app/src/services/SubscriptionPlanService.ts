import axios from "axios";
import type {
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
} from "../dto/request/SubscriptionPlanRequest.ts";
import type {
  GetAllSubscriptionPlansResponse,
  SubscriptionPlanResponse,
  DeleteSubscriptionPlanResponse,
} from "../dto/response/SubscriptionPlanResponse.ts";

export class SubscriptionPlanService {
  static async getAll(): Promise<GetAllSubscriptionPlansResponse> {
    const response = await axios.get<GetAllSubscriptionPlansResponse>("/plan");
    return response.data;
  }

  static async getById(id: number): Promise<SubscriptionPlanResponse> {
    const response = await axios.get<SubscriptionPlanResponse>(`/plan/${id}`);
    return response.data;
  }

  static async create(request: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
    const response = await axios.post<SubscriptionPlanResponse>("/plan", request);
    return response.data;
  }

  static async update(id: number, request: UpdateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
    const response = await axios.put<SubscriptionPlanResponse>(`/plan/${id}`, request);
    return response.data;
  }

  static async delete(id: number): Promise<DeleteSubscriptionPlanResponse> {
    const response = await axios.delete<DeleteSubscriptionPlanResponse>(`/plan/${id}`);
    return response.data;
  }

  static async toggleStatus(id: number): Promise<SubscriptionPlanResponse> {
    const response = await axios.patch<SubscriptionPlanResponse>(`/plan/${id}/status`);
    return response.data;
  }
}
