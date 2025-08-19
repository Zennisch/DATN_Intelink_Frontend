import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../contexts/DashboardContext";
import icon from "../../assets/icon.png";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { logout } = useAuth();

	// Try to get dashboard context, but don't fail if not available
	let dashboardContext;
	try {
		dashboardContext = useDashboard();
	} catch {
		dashboardContext = null;
	}

	const menuItems = [
		{
			icon: "📊",
			label: "Dashboard",
			path: "/dashboard",
			dashboardView: "overview" as const,
		},
		{
			icon: "🔗",
			label: "Short URLs",
			path: "/short-urls",
			dashboardView: "short-urls" as const,
		},
		{
			icon: "�",
			label: "Statistics",
			path: "/statistics",
			dashboardView: "statistics" as const,
		},
		{
			icon: "🌐",
			label: "Domains",
			path: "/domains",
		},
		{
			icon: "🎯",
			label: "Support",
			path: "/support",
		},
		{
			icon: "⚙️",
			label: "Settings",
			path: "/settings",
		},
	];

	const handleNavigation = (item: (typeof menuItems)[0]) => {
		// If we're on dashboard and have dashboard context, use it for certain views
		if (
			location.pathname === "/dashboard" &&
			dashboardContext &&
			item.dashboardView
		) {
			dashboardContext.setActiveView(item.dashboardView);
		} else {
			// Otherwise, navigate normally
			navigate(item.path);
		}

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
				className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0`}
			>
				<div className="flex flex-col h-full">
					{/* Logo */}
					<div className="flex items-center px-6 py-4 border-b border-gray-200">
						<img src={icon} alt="Intelink Logo" className="w-8 h-8 mr-3" />
						<span className="text-xl font-bold text-gray-900">Intelink</span>
					</div>

					{/* Navigation Menu */}
					<nav className="flex-1 px-4 py-6">
						<ul className="space-y-2">
							{menuItems.map((item) => {
								// Enhanced active state logic
								let isActive = location.pathname === item.path;

								// If we're on dashboard and have dashboard context, check dashboard view
								if (
									location.pathname === "/dashboard" &&
									dashboardContext &&
									item.dashboardView
								) {
									isActive = dashboardContext.activeView === item.dashboardView;
								}

								return (
									<li key={item.path}>
										<button
											onClick={() => handleNavigation(item)}
											className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
												isActive
													? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
													: "text-gray-700 hover:bg-gray-100"
											}`}
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
					<div className="px-4 py-4 border-t border-gray-200">
						<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
							<div className="text-sm font-medium mb-1">
								2/10 links available
							</div>
							<div className="text-xs opacity-90 mb-3">
								Enjoying Intelink? Consider upgrading your plan so you can go
								limitless.
							</div>
							<button className="w-full bg-white text-blue-600 text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
								Upgrade now →
							</button>
						</div>
					</div>

					{/* Sign Out */}
					<div className="px-4 py-4 border-t border-gray-200">
						<button
							onClick={handleLogout}
							className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
						>
							<span className="mr-3 text-lg">🚪</span>
							Sign out
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
