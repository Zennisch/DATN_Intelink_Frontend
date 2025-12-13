import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/primary';
import type { CalculateCostResponse } from '../dto/SubscriptionDTO';
import PageSpinner from '../components/layout/PageSpinner';
import { SubscriptionService } from '../services/SubscriptionService';

const SubscriptionCheckoutPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const { createVNPayPayment } = usePayment();
    const { createSubscription } = useSubscription();
    const { refreshUser } = useAuth();
    
    const [costDetails, setCostDetails] = useState<CalculateCostResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCost = async () => {
            if (!planId) return;
            try {
                setIsLoading(true);
                const response = await SubscriptionService.calculateCost({ planId: parseInt(planId) });
                setCostDetails(response);
            } catch (err) {
                console.error('Failed to calculate cost:', err);
                setError('Failed to load subscription details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCost();
    }, [planId]);

    const handleConfirm = async () => {
        if (!planId || !costDetails) return;
        try {
            setIsSubmitting(true);
            
            // 1. Create Subscription
            const subResponse = await createSubscription({ planId: parseInt(planId) });
            
            // 2. Create VNPay Payment
            const paymentResponse = await createVNPayPayment({
                subscriptionId: subResponse.id,
                amount: costDetails.finalCost,
                currency: 'VND'
            });

            // 3. Redirect to VNPay
            if (paymentResponse.paymentUrl) {
                window.location.href = paymentResponse.paymentUrl;
            } else {
                throw new Error('No payment URL returned');
            }
        } catch (err) {
            console.error('Subscription process failed:', err);
            setError('Failed to process subscription. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <PageSpinner />;
    }

    if (error || !costDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <h3 className="text-lg font-medium text-red-600 mb-4">Error</h3>
                        <p className="text-gray-500 mb-6">{error || 'Plan not found'}</p>
                        <Button onClick={() => navigate('/plans')} fullWidth>
                            Back to Plans
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/plans')}
                    className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600 transition-colors"
                    icon={<span className="mr-2">←</span>}
                >
                    Back to Plans
                </Button>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Subscription Summary
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Review your plan details before confirming.
                        </p>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">New Plan</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{costDetails.planType}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{costDetails.planPrice.toLocaleString()}đ</dd>
                            </div>
                            
                            {costDetails.currentPlanType && (
                                <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Proration Details</h4>
                                    <div className="grid grid-cols-1 gap-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-500">Current Plan Credit ({costDetails.currentPlanType})</span>
                                            <span className="text-sm font-medium text-green-600">-{costDetails.proratedCredit.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="sm:col-span-2 border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <dt className="text-base font-bold text-gray-900">Total Due Today</dt>
                                    <dd className="text-2xl font-bold text-blue-600">{costDetails.finalCost.toLocaleString()}đ</dd>
                                </div>
                                {costDetails.message && (
                                    <p className="mt-2 text-sm text-gray-500 italic">
                                        {costDetails.message}
                                    </p>
                                )}
                            </div>
                        </dl>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => navigate('/plans')}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleConfirm}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Confirm Subscription
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCheckoutPage;
