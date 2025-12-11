import React, { useEffect, useState } from "react";
import { SubscriptionPlanService } from "../services/SubscriptionPlanService.ts";
import { useAuth } from "../hooks/useAuth";
import { Spinner } from "../components/ui/Spinner.tsx";
import { Button } from "../components/ui/Button.tsx";
import type { SubscriptionPlanResponse } from "../dto/response/SubscriptionPlanResponse.ts";
import { Sidebar } from "../components/layout/Sidebar.tsx";

const SubscriptionPlansPage: React.FC = () => {
	const navigate =
		(window as any).navigate ||
		((url: string) => {
			window.location.href = url;
		});
	const { user, isLoading: authLoading } = useAuth();
	const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [registeringId, _] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		SubscriptionPlanService.getAll()
			.then((res) => {
				setPlans(res.plans);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to load subscription plans.");
				setLoading(false);
			});
	}, []);

	const currentPlanType = user?.currentSubscription?.planType;

	const handleRegister = (plan: SubscriptionPlanResponse) => {
		navigate(`/plans/${plan.id}/cost`);
	};

	if (loading || authLoading) return <Spinner />;

	return (
		<div className="flex flex-row justify-start items-center">
			<Sidebar isOpen={true} onClose={() => {}} />

			<div className="max-w-7xl mx-auto pl-56 pt-28 flex flex-col items-center justify-center ">
				<h2 className="text-3xl font-bold mb-6 text-center">
					Subscription Plans
				</h2>
				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
						{error}
					</div>
				)}
				<div className="flex flex-row flex-wrap justify-center items-stretch gap-8 w-full">
					{plans.length === 0 ? (
						<div className="text-center text-gray-500 w-full">
							No subscription plans available.
						</div>
					) : (
						plans.map((plan) => {
							const isCurrent = currentPlanType === plan.type;
							const isActive = plan.active;
							return (
								<div
									key={plan.id}
									className={`min-w-[320px] max-w-xs rounded-lg shadow-md p-6 flex flex-col bg-white border ${!isActive ? "border-gray-300 opacity-60" : "border-blue-500"}`}
								>
									<h3 className="text-xl font-semibold mb-2 text-blue-700 uppercase">
										{plan.type}
									</h3>
									<p className="mb-2 text-gray-700">
										{plan.description || "No description."}
									</p>
									<p className="mb-2 font-bold text-lg">
										Price:{" "}
										<span className="text-green-600">{plan.price} VND</span> /{" "}
										{plan.billingInterval}
									</p>
									<ul className="mb-4 text-sm text-gray-600 list-disc list-inside">
										<li>
											Max{" "}
											<span className="font-medium">{plan.maxShortUrls}</span>{" "}
											short URLs
										</li>
										<li>
											Short code customization:{" "}
											<span
												className={
													plan.shortCodeCustomizationEnabled
														? "text-green-600"
														: "text-red-500"
												}
											>
												{plan.shortCodeCustomizationEnabled ? "Yes" : "No"}
											</span>
										</li>
										<li>
											Statistics:{" "}
											<span
												className={
													plan.statisticsEnabled
														? "text-green-600"
														: "text-red-500"
												}
											>
												{plan.statisticsEnabled ? "Yes" : "No"}
											</span>
										</li>
										<li>
											Custom domain:{" "}
											<span
												className={
													plan.customDomainEnabled
														? "text-green-600"
														: "text-red-500"
												}
											>
												{plan.customDomainEnabled ? "Yes" : "No"}
											</span>
										</li>
										<li>
											API access:{" "}
											<span
												className={
													plan.apiAccessEnabled
														? "text-green-600"
														: "text-red-500"
												}
											>
												{plan.apiAccessEnabled ? "Yes" : "No"}
											</span>
										</li>
									</ul>
									{!isActive && (
										<div className="text-xs text-gray-500 mb-2">
											This plan is currently unavailable.
										</div>
									)}
									<Button
										disabled={
											isCurrent ||
											!isActive ||
											registeringId === plan.id.toString()
										}
										className={`w-full py-2 mt-auto rounded ${isCurrent ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
										onClick={() => handleRegister(plan)}
									>
										{isCurrent
											? "Current plan"
											: registeringId === plan.id.toString()
												? "Registering..."
												: "Register"}
									</Button>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};
export default SubscriptionPlansPage;
