import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubscriptionService } from "../services/SubscriptionService.ts";
import type { SubscriptionCostResponse } from "../dto/response/SubscriptionCostResponse.ts";
import { Button } from "../components/ui/Button.tsx";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout.tsx";

const PaymentCostPage: React.FC = () => {
	const { planId } = useParams<{ planId: string }>();
	const navigate = useNavigate();
	const [cost, setCost] = useState<SubscriptionCostResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [applyImmediately, setApplyImmediately] = useState(false);
	const [registering, setRegistering] = useState(false);

	useEffect(() => {
		if (!planId) return;
		setLoading(true);
		SubscriptionService.getCost(Number(planId), applyImmediately)
			.then((res) => {
				setCost(res);
				setLoading(false);
			})
			.catch(() => {
				setError("Failed to fetch cost info.");
				setLoading(false);
			});
	}, [planId, applyImmediately]);

	const handleRegister = async () => {
		if (!planId) return;
		setRegistering(true);
		try {
			const res = await SubscriptionService.register({
				subscriptionPlanId: Number(planId),
				applyImmediately,
			});
			if (res.paymentUrl && res.paymentUrl !== "") {
				window.open(res.paymentUrl, "_blank");
			} else {
				navigate("/dashboard");
			}
		} catch (e) {
			setError("Registration failed. Please try again.");
		} finally {
			setRegistering(false);
		}
	};

	return (
		<AuthenticatedLayout>
			<div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
				<div className="w-full flex justify-start mb-4">
					<Button
						className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 hover:bg-gray-200 text-gray-700 rounded shadow"
						onClick={() => navigate(-1)}
					>
						&larr; Back
					</Button>
				</div>
				<h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
					Subscription Cost Details
				</h2>
				<div className="mb-4 flex items-center space-x-2">
					<input
						type="checkbox"
						id="applyImmediately"
						checked={applyImmediately}
						onChange={(e) => setApplyImmediately(e.target.checked)}
						className="mr-2"
					/>
					<label htmlFor="applyImmediately" className="text-sm">
						Apply immediately
					</label>
				</div>
				{loading ? (
					<div className="flex items-center justify-center py-8">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
					</div>
				) : error ? (
					<div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm md:text-base">{error}</div>
				) : cost ? (
					<div className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6 mb-6">
						<div className="space-y-3">
							<div className="flex justify-between items-center pb-3 border-b border-gray-200">
								<span className="text-xs md:text-sm text-gray-600">Plan ID:</span>
								<span className="text-xs md:text-sm font-semibold">{cost.subscriptionPlanId}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs md:text-sm text-gray-600">Plan Price:</span>
								<span className="text-xs md:text-sm font-semibold text-green-600">
									{cost.planPrice.toLocaleString()} {cost.currency}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs md:text-sm text-gray-600">Pro-rate Value:</span>
								<span className="text-xs md:text-sm font-semibold">
									{cost.proRateValue.toLocaleString()} {cost.currency}
								</span>
							</div>
							<div className="flex justify-between items-center py-3 border-y border-gray-200 bg-blue-50 -mx-4 md:-mx-6 px-4 md:px-6">
								<span className="text-sm md:text-base font-medium text-gray-900">Amount to Pay:</span>
								<span className="text-base md:text-lg font-bold text-blue-600">
									{cost.amountToPay.toLocaleString()} {cost.currency}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs md:text-sm text-gray-600">Your Credit Balance:</span>
								<span className="text-xs md:text-sm font-semibold">
									{cost.creditBalance.toLocaleString()} {cost.currency}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-xs md:text-sm text-gray-600">Start Date:</span>
								<span className="text-xs md:text-sm font-semibold">{cost.startDate}</span>
							</div>
							{cost.message && (
								<div className="mt-3 pt-3 border-t border-gray-200">
									<p className="text-xs md:text-sm text-gray-600 italic">{cost.message}</p>
								</div>
							)}
						</div>
					</div>
				) : null}
				<Button
					className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
					onClick={handleRegister}
					disabled={registering || loading}
				>
					{registering ? "Registering..." : "Register & Pay with VNPay"}
				</Button>
			</div>
		</AuthenticatedLayout>
	);
};

export default PaymentCostPage;
