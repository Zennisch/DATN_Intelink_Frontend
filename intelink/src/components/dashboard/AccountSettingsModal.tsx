import { useState, useEffect, type FormEvent } from 'react';
import { Modal, Input, Button } from '../primary';
import { useAuth } from '../../hooks/useAuth';

interface AccountSettingsModalProps {
    open: boolean;
    onClose: () => void;
}

export const AccountSettingsModal = ({ open, onClose }: AccountSettingsModalProps) => {
    const { user, updateProfile, updatePassword } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    
    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        username: '',
        profileName: '',
    });

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open && user) {
            setProfileForm({
                username: user.username || '',
                profileName: user.profileName || '',
            });
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setError(null);
            setSuccess(null);
            setActiveTab('profile');
        }
    }, [open, user]);

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            await updateProfile({
                username: profileForm.username,
                profileName: profileForm.profileName,
            });
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            await updatePassword({
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword,
            });
            setSuccess('Password updated successfully');
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Account Settings"
            size="lg"
        >
            <div className="flex flex-col gap-6">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'profile'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => {
                            setActiveTab('profile');
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        Profile
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${
                            activeTab === 'password'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => {
                            setActiveTab('password');
                            setError(null);
                            setSuccess(null);
                        }}
                    >
                        Password
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md">
                        {success}
                    </div>
                )}

                {/* Profile Form */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <Input
                            label="Username"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="Profile Name"
                            value={profileForm.profileName}
                            onChange={(e) => setProfileForm({ ...profileForm, profileName: e.target.value })}
                            fullWidth
                        />
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                )}

                {/* Password Form */}
                {activeTab === 'password' && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <Input
                            label="Current Password"
                            type="password"
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            required
                            fullWidth
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            required
                            helpText="Minimum 6 characters"
                            fullWidth
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            required
                            fullWidth
                        />
                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                Update Password
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};
