import React, { useEffect, useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import PageSpinner from '../../components/layout/PageSpinner';
import type { SubscriptionResponse } from '../../dto/SubscriptionDTO';

const SubscriptionHistoryPage: React.FC = () => {
    const { getAllSubscriptions } = useSubscription();
    const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const data = await getAllSubscriptions();
                setSubscriptions(data);
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    if (isLoading) {
        return <PageSpinner />;
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription History</h1>
                <p className="text-gray-500 mt-1">View your subscription history and status.</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plan
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No subscription history found.
                                    </td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{sub.planType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${sub.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {sub.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.activatedAt ? new Date(sub.activatedAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.planDetails?.price ? `${sub.planDetails.price.toLocaleString()}đ` : 'Free'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHistoryPage;
