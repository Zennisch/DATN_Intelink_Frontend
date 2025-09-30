import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubscriptionService } from "../services/SubscriptionService.ts";
import type { SubscriptionCostResponse } from "../dto/response/SubscriptionCostResponse.ts";
import { Button } from "../components/ui/Button.tsx";
import { Sidebar } from "../components/layout/Sidebar.tsx";

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
		<div className="flex flex-row justify-start items-center">
			<Sidebar />

			<div className="max-w-lg mx-auto py-8 pl-16 flex flex-col items-center justify-center min-h-[80vh]">
				<div className="w-full flex justify-start mb-4">
					<Button
						className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded shadow"
						onClick={() => navigate(-1)}
					>
						&larr; Back
					</Button>
				</div>
				<h2 className="text-2xl font-bold mb-4 text-center">
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
					<div>Loading...</div>
				) : error ? (
					<div className="text-red-500">{error}</div>
				) : cost ? (
					<div className="w-full bg-white rounded shadow p-4 mb-6">
						<div className="mb-2 text-sm text-gray-600">
							Plan ID:{" "}
							<span className="font-semibold">{cost.subscriptionPlanId}</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Plan Price:{" "}
							<span className="font-semibold text-green-600">
								{cost.planPrice} {cost.currency}
							</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Pro-rate Value:{" "}
							<span className="font-semibold">
								{cost.proRateValue} {cost.currency}
							</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Amount to Pay:{" "}
							<span className="font-semibold text-blue-600">
								{cost.amountToPay} {cost.currency}
							</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Your Credit Balance:{" "}
							<span className="font-semibold">
								{cost.creditBalance} {cost.currency}
							</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Start Date:{" "}
							<span className="font-semibold">{cost.startDate}</span>
						</div>
						<div className="mb-2 text-sm text-gray-600">
							Message: <span className="font-semibold">{cost.message}</span>
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
		</div>
	);
};

export default PaymentCostPage;
