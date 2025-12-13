import React, { useEffect, useState } from 'react';
import { useApiKey } from '../../hooks/useApiKey';
import { Button, Input, Modal } from '../../components/primary';
import PageSpinner from '../../components/layout/PageSpinner';
import type { ApiKeyResponse } from '../../dto/ApiKeyDTO';

const APIsPage: React.FC = () => {
    const { apiKeys, isLoading, fetchApiKeys, createApiKey, deleteApiKey } = useApiKey();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [createdKey, setCreatedKey] = useState<ApiKeyResponse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        fetchApiKeys();
    }, [fetchApiKeys]);

    const handleCreate = async () => {
        if (!newKeyName.trim()) return;
        setIsSubmitting(true);
        try {
            const key = await createApiKey({ name: newKeyName });
            setCreatedKey(key);
            setIsCreateModalOpen(false);
            setIsSuccessModalOpen(true);
            setNewKeyName('');
        } catch (error) {
            // Error handled in hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
            await deleteApiKey(id);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    };

    if (isLoading && apiKeys.length === 0) return <PageSpinner />;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
                    <p className="text-gray-500 mt-1">Manage your API keys for external access.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} icon={<span>+</span>}>
                    Create New Key
                </Button>
            </div>

            {/* List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                {apiKeys.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No API keys found. Create one to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Prefix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {apiKeys.map((key) => (
                                    <tr key={key.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{key.keyPrefix}...</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(key.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleDelete(key.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New API Key"
                size="lg"
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} loading={isSubmitting} disabled={!newKeyName.trim()}>Create</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Enter a name for your API key to identify it later.</p>
                    <Input
                        label="Key Name"
                        placeholder="e.g. Production Server"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                    />
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                open={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="API Key Created"
                size="xl"
                footer={
                    <Button onClick={() => setIsSuccessModalOpen(false)}>Done</Button>
                }
            >
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <p className="text-sm text-green-800 font-medium">
                            Your API key has been created successfully.
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                            Please copy it now. You won't be able to see it again!
                        </p>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                        <div className="flex gap-2">
                            <code className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-sm font-mono break-all border">
                                {createdKey?.rawKey}
                            </code>
                            <Button variant="secondary" onClick={() => createdKey?.rawKey && copyToClipboard(createdKey.rawKey)}>
                                {isCopied ? <i className="fa-solid fa-check text-green-600"></i> : <i className="fa-regular fa-copy"></i>}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default APIsPage;