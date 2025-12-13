import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Page } from "../../pages/DashboardPage";
import { Button } from "../primary";
import { useAuth } from "../../hooks/useAuth";
import { useShortUrl } from "../../hooks/useShortUrl";

interface NavigationButton {
	text: string;
	icon: string;
	onClick: () => void;
}

interface DashboardSidebarProps {
	currentPage: Page;
	setCurrentPage: (page: Page) => void;
	setCreateNewModalOpen: (open: boolean) => void;
}

export const DashboardSidebar = ({
	currentPage,
	setCurrentPage,
	setCreateNewModalOpen,
}: DashboardSidebarProps) => {
	const { user, logout } = useAuth();
	const { getShortUrls, refreshSignal } = useShortUrl();
	const navigate = useNavigate();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [totalUrls, setTotalUrls] = useState(0);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const fetchTotalUrls = async () => {
			if (user) {
				try {
					const response = await getShortUrls({ page: 0, size: 1 });
					setTotalUrls(response.totalElements);
				} catch (error) {
					console.error("Failed to fetch total urls", error);
				}
			}
		};
		fetchTotalUrls();
	}, [user, refreshSignal, getShortUrls]);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setShowUserMenu(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const createNewButton: NavigationButton = {
		text: "Create New",
		icon: "🆕",
		onClick: () => {
			setCreateNewModalOpen(true);
		},
	};

	const logoutButton: NavigationButton = {
		text: "Log Out",
		icon: "🚪",
		onClick: () => {},
	};

	const navigationButtons: Array<NavigationButton & { page: Page }> = [
		{
			text: "Overview",
			icon: "📊",
			page: "overview",
			onClick: () => {
				setCurrentPage("overview");
			},
		},
		{
			text: "Links",
			icon: "🔗",
			page: "links",
			onClick: () => {
				setCurrentPage("links");
			},
		},
		{
			text: "Statistics",
			icon: "📈",
			page: "statistics",
			onClick: () => {
				setCurrentPage("statistics");
			},
		},
		{
			text: "APIs",
			icon: "⚙️",
			page: "apis",
			onClick: () => {
				setCurrentPage("apis");
			},
		},
	];

	return (
		<div className="flex flex-col w-64 bg-white p-4 gap-4 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-10">
			{/* Navigation Buttons */}
			<div className="flex flex-1 flex-col justify-between">
				<div className="flex flex-col gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start mb-4"
						icon={<span>{createNewButton.icon}</span>}
						onClick={createNewButton.onClick}
					>
						Create New
					</Button>

					{navigationButtons.map((button, index) => {
						const isActive = currentPage === button.page;
						return (
							<Button
								key={index}
								size="sm"
								variant="ghost"
								className={`w-full justify-start ${
									isActive ? "text-black bg-gray-200!" : ""
								}`}
								icon={<span>{button.icon}</span>}
								onClick={button.onClick}
							>
								{button.text}
							</Button>
						);
					})}
				</div>

				<div className="flex flex-col gap-4">
					{/* Upgrade Section */}
					{user && (
						<div className="flex-shrink-0">
							{(() => {
								const maxLinks = user.currentSubscription?.planDetails?.maxShortUrls || 10;
								const isUnlimited = maxLinks === -1;
								const isNearLimit = !isUnlimited && totalUrls >= maxLinks * 0.8;
								const isFreeUser = !user.currentSubscription || user.currentSubscription.planType === 'FREE';

								// Show upgrade section for free users or users approaching limits (but not unlimited users)
								const shouldShowUpgrade = isFreeUser || (isNearLimit && !isUnlimited);

								if (shouldShowUpgrade) {
									return (
										<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-3 text-white">
											<div className="text-xs font-medium mb-1">
												{isUnlimited
													? `${totalUrls} links`
													: `${totalUrls}/${maxLinks} links`
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
															? `${totalUrls} (Unlimited)`
															: `${totalUrls}/${maxLinks}`
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
													}}
												>
													Manage
												</button>
												<button
													className="flex-1 bg-white/90 text-purple-600 text-xs font-semibold py-2 px-3 rounded-md hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
													onClick={() => {
														setCurrentPage("subscriptions");
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

					<div ref={menuRef} className="relative">
						{showUserMenu && (
							<div className="absolute bottom-full left-0 w-64 mb-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
								<div className="p-4 bg-slate-50 border-b border-slate-100">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-white shadow-sm">
											{user?.profilePictureUrl ? (
												<img src={user.profilePictureUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
											) : (
												(user?.username?.[0] || 'U').toUpperCase()
											)}
										</div>
										<div className="overflow-hidden">
											<p className="font-bold text-slate-900 truncate text-sm">{user?.profileName || user?.username}</p>
											<p className="text-xs text-slate-500 truncate">{user?.email}</p>
										</div>
									</div>
								</div>
								<div className="p-1.5">
									<button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-3">
										<i className="fas fa-user-cog w-4 text-center"></i> Account Settings
									</button>
									<button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-3">
										<i className="fas fa-credit-card w-4 text-center"></i> Billing & Plans
									</button>
									<div className="h-px bg-slate-100 my-1 mx-2"></div>
									<button className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-3">
										<i className="fas fa-question-circle w-4 text-center"></i> Help & Support
									</button>
								</div>
							</div>
						)}

						<Button
							variant="ghost"
							size="sm"
							className={`w-full justify-start mb-1 ${showUserMenu ? 'bg-slate-100 text-indigo-600' : ''}`}
							icon={
								<div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold">
									{(user?.username?.[0] || 'U').toUpperCase()}
								</div>
							}
							onClick={() => setShowUserMenu(!showUserMenu)}
						>
							<span className="truncate flex-1 text-left">{user?.username || 'User'}</span>
							<i className={`fas fa-chevron-up text-[10px] transition-transform ${showUserMenu ? 'rotate-180' : ''}`}></i>
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
							icon={<span>{logoutButton.icon}</span>}
							onClick={() => logout()}
						>
							{logoutButton.text}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
