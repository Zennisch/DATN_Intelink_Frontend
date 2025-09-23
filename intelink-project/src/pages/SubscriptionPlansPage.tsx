import React, { useEffect, useState } from "react";
import { SubscriptionPlanService } from "../services/SubscriptionPlanService";
import { SubscriptionService } from "../services/SubscriptionService";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import type { SubscriptionPlanResponse } from "../dto/response/SubscriptionPlanResponse";
import type { RegisterSubscriptionRequest } from "../dto/request/SubscriptionRequest";

const SubscriptionPlansPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SubscriptionPlanService.getAll()
      .then((res) => {
        setPlans(res.plans);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải danh sách gói đăng ký.");
        setLoading(false);
      });
  }, []);

  const currentPlanType = user?.currentSubscription?.planType;

  const handleRegister = async (plan: SubscriptionPlanResponse) => {
    setRegisteringId(plan.id.toString());
    setError(null);
    try {
      const request: RegisterSubscriptionRequest = {
        subscriptionPlanId: plan.id,
      };
      await SubscriptionService.register(request);
      alert("Đăng ký thành công! Vui lòng kiểm tra thanh toán.");
    } catch (e) {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading || authLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Subscription Plans</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <div className="flex flex-row space-x-6 overflow-x-auto pb-4">
        {plans.length === 0 ? (
          <div className="text-center text-gray-500 w-full">No subscription plans available.</div>
        ) : (
          plans.map((plan) => {
            const isCurrent = currentPlanType === plan.type;
            const isActive = plan.active;
            return (
              <div
                key={plan.id}
                className={`min-w-[320px] max-w-xs rounded-lg shadow-md p-6 flex flex-col bg-white border ${!isActive ? "border-gray-300 opacity-60" : "border-blue-500"}`}
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-700 uppercase">{plan.type}</h3>
                <p className="mb-2 text-gray-700">{plan.description || "No description."}</p>
                <p className="mb-2 font-bold text-lg">Price: <span className="text-green-600">{plan.price} VND</span> / {plan.billingInterval}</p>
                <ul className="mb-4 text-sm text-gray-600 list-disc list-inside">
                  <li>Max <span className="font-medium">{plan.maxShortUrls}</span> short URLs</li>
                  <li>Short code customization: <span className={plan.shortCodeCustomizationEnabled ? "text-green-600" : "text-red-500"}>{plan.shortCodeCustomizationEnabled ? "Yes" : "No"}</span></li>
                  <li>Statistics: <span className={plan.statisticsEnabled ? "text-green-600" : "text-red-500"}>{plan.statisticsEnabled ? "Yes" : "No"}</span></li>
                  <li>Custom domain: <span className={plan.customDomainEnabled ? "text-green-600" : "text-red-500"}>{plan.customDomainEnabled ? "Yes" : "No"}</span></li>
                  <li>API access: <span className={plan.apiAccessEnabled ? "text-green-600" : "text-red-500"}>{plan.apiAccessEnabled ? "Yes" : "No"}</span></li>
                </ul>
                {!isActive && <div className="text-xs text-gray-500 mb-2">This plan is currently unavailable.</div>}
                <Button
                  disabled={isCurrent || !isActive || registeringId === plan.id.toString()}
                  className={`w-full py-2 mt-auto rounded ${isCurrent ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                  onClick={() => handleRegister(plan)}
                >
                  {isCurrent ? "Current plan" : registeringId === plan.id.toString() ? "Registering..." : "Register"}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
