import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/primary';
import PageSpinner from '../components/layout/PageSpinner';

const PlansPage: React.FC = () => {
    const navigate = useNavigate();
    const { getAllPlans, plans, isLoading: isPlansLoading } = useSubscription();
    const { user } = useAuth();
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

    useEffect(() => {
        getAllPlans();
    }, []);

    const handleSubscribe = (planId: number) => {
        navigate(`/checkout/${planId}`);
    };

    if (isPlansLoading && plans.length === 0) {
        return <PageSpinner />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600 transition-colors"
                        icon={<span className="mr-2">←</span>}
                    >
                        Back
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Choose the right plan for you
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                            Unlock the full potential of your links with our flexible pricing plans.
                        </p>
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {plans.map((plan) => {
                        const isCurrentPlan = user?.currentSubscription?.planDetails?.planId === plan.id;
                        // If user has no subscription, they are effectively on FREE plan if the plan type is FREE
                        // But usually the backend returns a currentSubscription even for free users.
                        // Let's rely on planId match.
                        
                        // Fallback for free user detection if currentSubscription is null but plan is FREE
                        const isFreePlan = plan.type === 'FREE';
                        const isUserOnFree = !user?.currentSubscription || user?.currentSubscription.planType === 'FREE';
                        const isCurrent = isCurrentPlan || (isUserOnFree && isFreePlan && !user?.currentSubscription?.planDetails?.planId);

                        return (
                            <div
                                key={plan.id}
                                className={`rounded-2xl shadow-xl bg-white border transition-all duration-200 hover:shadow-2xl flex flex-col
                                    ${isCurrent ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'}
                                `}
                            >
                                <div className="p-8 flex-1">
                                    <h3 className="text-2xl font-semibold text-gray-900">
                                        {plan.type}
                                    </h3>
                                    <p className="mt-4 text-gray-500 text-sm h-10">
                                        {plan.description || "The perfect starting point."}
                                    </p>
                                    <div className="mt-8">
                                        <span className="text-4xl font-extrabold text-gray-900">
                                            ${plan.price}
                                        </span>
                                        <span className="text-base font-medium text-gray-500">
                                            /{plan.billingInterval.toLowerCase()}
                                        </span>
                                    </div>

                                    {/* Feature List */}
                                    <ul className="mt-8 space-y-4">
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="text-green-500">✓</span>
                                            </div>
                                            <p className="ml-3 text-sm text-gray-700">
                                                {plan.maxShortUrls === -1 ? 'Unlimited' : plan.maxShortUrls} Short URLs
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <span className="text-green-500">✓</span>
                                            </div>
                                            <p className="ml-3 text-sm text-gray-700">
                                                {plan.maxUsagePerUrl === -1 ? 'Unlimited' : plan.maxUsagePerUrl} Clicks per URL
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {plan.shortCodeCustomizationEnabled ? (
                                                    <span className="text-green-500">✓</span>
                                                ) : (
                                                    <span className="text-gray-300">×</span>
                                                )}
                                            </div>
                                            <p className={`ml-3 text-sm ${plan.shortCodeCustomizationEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                                Custom Short Codes
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {plan.statisticsEnabled ? (
                                                    <span className="text-green-500">✓</span>
                                                ) : (
                                                    <span className="text-gray-300">×</span>
                                                )}
                                            </div>
                                            <p className={`ml-3 text-sm ${plan.statisticsEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                                Advanced Statistics
                                            </p>
                                        </li>
                                        <li className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {plan.apiAccessEnabled ? (
                                                    <span className="text-green-500">✓</span>
                                                ) : (
                                                    <span className="text-gray-300">×</span>
                                                )}
                                            </div>
                                            <p className={`ml-3 text-sm ${plan.apiAccessEnabled ? 'text-gray-700' : 'text-gray-400'}`}>
                                                API Access
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="p-8 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                                    <Button
                                        variant={isCurrent ? "outline" : "primary"}
                                        className="w-full justify-center py-3 text-base font-medium"
                                        disabled={isCurrent || processingPlanId === plan.id}
                                        loading={processingPlanId === plan.id}
                                        onClick={() => handleSubscribe(plan.id)}
                                    >
                                        {isCurrent ? "Current Plan" : "Subscribe"}
                                    </Button>
                                    {isCurrent && (
                                        <p className="mt-2 text-xs text-center text-gray-500">
                                            You are currently subscribed to this plan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlansPage;
