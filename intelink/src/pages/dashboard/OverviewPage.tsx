import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/primary';

export default function OverviewPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center text-slate-400 animate-pulse">
                    <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-indigo-500"></i>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
             {/* Decorative background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-50/50 via-white/50 to-slate-50/0 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/4 -left-24 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 sm:p-8 z-0 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Overview</h1>
                    <p className="text-slate-500 text-sm sm:text-base mt-1">Manage your personal information and subscription details.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            <div className="w-24 h-24 rounded-full bg-white p-1 relative z-10 mt-8 shadow-lg">
                                {user.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                                        {(user.username?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}
                                {user.verified && (
                                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs" title="Verified">
                                        <i className="fas fa-check"></i>
                                    </div>
                                )}
                            </div>
                            
                            <h2 className="text-xl font-bold text-slate-900 mt-4">{user.profileName || user.username}</h2>
                            <p className="text-slate-500 text-sm">@{user.username}</p>
                            
                            <div className="mt-4 flex flex-wrap justify-center gap-2">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                    {user.role}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                    user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                    {user.status}
                                </span>
                            </div>

                            <div className="w-full mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{user.totalShortUrls}</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Links</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{user.totalClicks}</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide">Clicks</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <i className="far fa-envelope text-slate-400"></i>
                                        <span className="truncate">{user.email}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">User ID</p>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <i className="far fa-id-card text-slate-400"></i>
                                        <span className="font-mono text-sm">#{user.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Subscription Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Current Subscription</h3>
                                {user.currentSubscription?.active ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {user.currentSubscription ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-sm text-slate-500 mb-1">Plan Type</p>
                                            <p className="text-xl font-bold text-indigo-600">{user.currentSubscription.planType}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-sm text-slate-500 mb-1">Expires At</p>
                                            <p className="text-lg font-semibold text-slate-900">{formatDate(user.currentSubscription.expiresAt)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700">Plan Usage</span>
                                            <span className="text-sm text-slate-500">
                                                {user.totalShortUrls} / {user.currentSubscription.planDetails.maxShortUrls === -1 ? '∞' : user.currentSubscription.planDetails.maxShortUrls} Links
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                            <div 
                                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                                                style={{ 
                                                    width: `${user.currentSubscription.planDetails.maxShortUrls === -1 ? 0 : Math.min(100, (user.totalShortUrls / user.currentSubscription.planDetails.maxShortUrls) * 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Max Clicks/Link</p>
                                            <p className="font-medium text-slate-700">
                                                {user.currentSubscription.planDetails.maxUsagePerUrl === -1 ? 'Unlimited' : user.currentSubscription.planDetails.maxUsagePerUrl}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Custom Aliases</p>
                                            <p className="font-medium text-slate-700">
                                                {user.currentSubscription.planDetails.shortCodeCustomizationEnabled ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">Advanced Stats</p>
                                            <p className="font-medium text-slate-700">
                                                {user.currentSubscription.planDetails.statisticsEnabled ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 mb-1">API Access</p>
                                            <p className="font-medium text-slate-700">
                                                {user.currentSubscription.planDetails.apiAccessEnabled ? 'Enabled' : 'Disabled'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <p>No active subscription found.</p>
                                    <Button variant="primary" className="mt-4">Upgrade Plan</Button>
                                </div>
                            )}
                        </div>

                        {/* Account Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Account Activity</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                                    <p className="font-medium text-slate-700">{formatDate(user.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Last Login</p>
                                    <p className="font-medium text-slate-700">{formatDate(user.lastLoginAt)}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Balance Card */}
                         <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Current Balance</p>
                                    <h3 className="text-3xl font-bold">{user.balance.toLocaleString()} {user.currency}</h3>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <i className="fas fa-wallet text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}