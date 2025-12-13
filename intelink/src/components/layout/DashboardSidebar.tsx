import { useState, useRef, useEffect } from 'react';
import type { Page } from "../../pages/DashboardPage";
import { Button } from "../primary";
import { useAuth } from "../../hooks/useAuth";

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
	const [showUserMenu, setShowUserMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

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
		{
			text: "Domains",
			icon: "🌐",
			page: "domains",
			onClick: () => {
				setCurrentPage("domains");
			},
		},
	];

	return (
		<div className="flex flex-col w-52 bg-white p-4 gap-4 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-10">
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
	);
};
