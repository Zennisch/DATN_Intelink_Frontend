import axios from "axios";
import type {
  RegisterSubscriptionRequest
} from "../dto/request/SubscriptionRequest";
import type {
  SubscriptionResponse,
  GetAllSubscriptionsResponse,
  CancelSubscriptionResponse
} from "../dto/response/SubscriptionResponse";

export class SubscriptionService {
  static async getCost(subscriptionPlanId: number, applyImmediately: boolean = false): Promise<import("../dto/response/SubscriptionCostResponse").SubscriptionCostResponse> {
    const response = await axios.get("/subscription/cost", {
      params: { subscriptionPlanId, applyImmediately }
    });
    return response.data;
  }
  static async getAll(): Promise<GetAllSubscriptionsResponse> {
    const response = await axios.get<GetAllSubscriptionsResponse>("/subscription");
    return response.data;
  }

  static async getCurrent(): Promise<SubscriptionResponse> {
    const response = await axios.get<SubscriptionResponse>("/subscription/current");
    return response.data;
  }

  static async register(request: RegisterSubscriptionRequest): Promise<{ subscriptionId: string; paymentUrl: string }> {
    const response = await axios.post<{ subscriptionId: string; paymentUrl: string }>("/subscription", request);
    return response.data;
  }

  static async cancel(id: string): Promise<CancelSubscriptionResponse> {
    const response = await axios.post<CancelSubscriptionResponse>(`/subscription/${id}/cancel`);
    return response.data;
  }
}
