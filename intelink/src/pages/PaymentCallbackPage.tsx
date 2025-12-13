import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePayment } from '../hooks/usePayment';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from '../components/primary';
import PageSpinner from '../components/layout/PageSpinner';

const PaymentCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { vnpayCallback } = usePayment();
    const { refreshUser } = useAuth();
    const { refreshActiveSubscription } = useSubscription();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState<string>('Processing your payment...');

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Convert searchParams to object for the service
                const params: any = {};
                for (const [key, value] of searchParams.entries()) {
                    params[key] = value;
                }

                // 1. Send callback to backend
                await vnpayCallback(params);
                
                // 2. Activate subscription / Refresh state
                await refreshActiveSubscription();
                await refreshUser();
                
                setStatus('success');
                setMessage('Payment successful! Redirecting to dashboard...');
                
                // Redirect after a short delay
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (error) {
                console.error('Payment callback failed:', error);
                setStatus('error');
                setMessage('Payment processing failed. Please contact support if money was deducted.');
            }
        };

        processCallback();
    }, []);

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <span className="text-red-600 text-xl">✗</span>
                        </div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Payment Failed</h3>
                        <p className="text-sm text-gray-500 mb-6">{message}</p>
                        <Button onClick={() => navigate('/dashboard')} fullWidth>
                            Return to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="text-center">
                {status === 'success' ? (
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <span className="text-green-600 text-2xl">✓</span>
                    </div>
                ) : (
                    <PageSpinner />
                )}
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                    {status === 'success' ? 'Payment Successful!' : 'Processing Payment'}
                </h2>
                <p className="mt-2 text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default PaymentCallbackPage;
