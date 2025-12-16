import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import icon from "../../assets/icon.png";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();
	const { user } = useAuth();

	const menuItems = [
		{
			icon: "📊",
			label: "Dashboard",
			path: "/dashboard/overview",
			disabled: [],
		},
		{
			icon: "🔗",
			label: "Short URLs",
			path: "/dashboard/short-urls",
			disabled: [],
		},
		{
			icon: "📉",
			label: "Overview",
			path: "/dashboard/overview-stats",
			disabled: ["FREE",],
		},
		{
			icon: "📈",
			label: "Statistics",
			path: "/dashboard/statistics",
			disabled: ["FREE",]
		},
		{
			icon: "💻",
			label: "APIs",
			path: "/dashboard/apis",
			disabled: ["FREE", "PRO",]
		},
		{
			icon: "🌐",
			label: "Domains",
			path: "/dashboard/domains",
			disabled: ["FREE", "PRO"],
		},
		{
			icon: "⚙️",
			label: "Settings",
			path: "/dashboard/settings",
			disabled: [],
		},
	];

	const handleNavigation = (item: (typeof menuItems)[0]) => {
		navigate(item.path);

		if (window.innerWidth < 768) {
			onClose();
		}
	};

	const handleLogout = async () => {
		try {
			await logout(() => {
				navigate("/login");
			});
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	return (
		<>
			{/* Overlay for mobile */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
					} md:translate-x-0`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center px-6 py-4 border-b border-gray-200">
						{/*<img src={icon} alt="Intelink Logo" className="w-8 h-8 mr-3" />*/}
						{/*<span className="text-xl font-bold text-gray-900">Intelink</span>*/}
						<a href="/dashboard" className="flex items-center">
							<img src={icon} alt="Intelink Logo" className="w-8 h-8 mr-3" />
							<span className="text-xl font-bold text-gray-900">Intelink</span>
						</a>
					</div>

					{/* Navigation Menu */}
					<nav className="flex-1 overflow-y-auto px-4 py-4">
						<ul className="space-y-1">
							{menuItems.map((item) => {
								// Simple path-based active state
								const isActive = location.pathname === item.path;

								return (
									<li key={item.path}>
										<button
											onClick={() => handleNavigation(item)}
											className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
												? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
												: "text-gray-700 hover:bg-gray-100"
												} disabled:cursor-not-allowed disabled:opacity-50`}
											disabled={item.disabled.includes(user?.currentSubscription?.planType || 'FREE')}

										>
											<span className="mr-3 text-lg">{item.icon}</span>
											{item.label}
										</button>
									</li>
								);
							})}
						</ul>
					</nav>

					{/* Upgrade Section */}
					{user && (
						<div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
							{(() => {
								const maxLinks = user.currentSubscription?.planDetails?.maxShortUrls || 10;
								const isUnlimited = maxLinks === -1;
								const isNearLimit = !isUnlimited && user.totalShortUrls >= maxLinks * 0.8;
								const isFreeUser = !user.currentSubscription || user.currentSubscription.planType === 'FREE';

								// Show upgrade section for free users or users approaching limits (but not unlimited users)
								const shouldShowUpgrade = isFreeUser || (isNearLimit && !isUnlimited);

								if (shouldShowUpgrade) {
									return (
										<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
											<div className="text-xs font-medium mb-1">
												{isUnlimited
													? `${user.totalShortUrls} links`
													: `${user.totalShortUrls}/${maxLinks} links`
												}
											</div>
											<div className="text-[10px] opacity-90 mb-2 line-clamp-2">
												{isFreeUser
													? "Upgrade to unlock more features"
													: "Approaching limit. Upgrade now."
												}
											</div>
											<button
												className="w-full bg-white text-blue-600 text-xs font-medium py-1.5 px-2 rounded-md hover:bg-gray-50 transition-colors"
												onClick={() => {
													navigate("/plans");
													onClose();
												}}
											>
												{isFreeUser ? "Upgrade →" : "View Plans →"}
											</button>
										</div>
									);
								} else {
									// Show current plan info for premium users not approaching limits
									return (
										<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white shadow-lg">
											<div className="flex items-center justify-center mb-2">
												<span className="text-white text-base mr-1.5">✨</span>
												<div className="text-sm font-semibold text-white">
													{user.currentSubscription?.planType} Plan
												</div>
											</div>
											<div className="bg-white/10 rounded-md p-2 mb-3 backdrop-blur-sm">
												<div className="flex items-center justify-between text-xs text-white mb-1.5">
													<span className="font-medium">Links:</span>
													<span className="font-semibold">
														{isUnlimited
															? `${user.totalShortUrls} (Unlimited)`
															: `${user.totalShortUrls}/${maxLinks}`
														}
													</span>
												</div>
												<div className="flex items-center justify-between text-xs text-white">
													<span className="font-medium">Valid until:</span>
													<span className="font-semibold">
														{user.currentSubscription?.active
															? new Date(user.currentSubscription.expiresAt || '').toLocaleDateString('en-US', {
																month: 'short',
																day: 'numeric',
																year: 'numeric'
															})
															: "Inactive"
														}
													</span>
												</div>
											</div>
											<div className="flex gap-2">
												<button
													className="flex-1 bg-white text-blue-600 text-xs font-semibold py-2 px-3 rounded-md hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
													onClick={() => {
														navigate("/plans");
														onClose();
													}}
												>
													Manage
												</button>
												<button
													className="flex-1 bg-white/90 text-purple-600 text-xs font-semibold py-2 px-3 rounded-md hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
													onClick={() => {
														navigate("/dashboard/subscriptions");
														onClose();
													}}
												>
													History
												</button>
											</div>
										</div>
									);
								}
							})()}
						</div>
					)}

					{/* Sign Out */}
					<div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
						<button
							onClick={handleLogout}
							className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
						>
							<span className="mr-2 text-base">🚪</span>
							Sign out
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
