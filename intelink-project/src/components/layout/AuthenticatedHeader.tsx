import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ICONS, LANGUAGES } from "../../types/constants.ts";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLocation } from "react-router-dom";

interface AuthenticatedHeaderProps {
	onSidebarToggle: () => void;
	onLanguageChange?: (language: string) => void;
}

export const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
	onSidebarToggle,
	onLanguageChange,
}) => {
	const { user } = useAuth();
	const location = useLocation();
	const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.EN);
	const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
	const [showUserDropdown, setShowUserDropdown] = useState(false);
	const [showCreateDropdown, setShowCreateDropdown] = useState(false);
	const createDropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (createDropdownRef.current && !createDropdownRef.current.contains(event.target as Node)) {
				setShowCreateDropdown(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Try to get dashboard and create context, but don't fail if not available
	let dashboardContext;
	let createContext;
	try {
		dashboardContext = useDashboard();
	} catch {
		dashboardContext = null;
		createContext = null;
	}

	const languages = Object.values(LANGUAGES);

	const handleLanguageSelect = (language: string) => {
		setCurrentLanguage(language);
		setShowLanguageDropdown(false);
		onLanguageChange?.(language);
	};

	const handleCreateNew = () => {
		// If we're on dashboard page and contexts are available
		if (location.pathname === "/dashboard" && dashboardContext && createContext) {
			// Switch to short-urls view and open create form
			dashboardContext.setActiveView("short-urls");
			// Wait a bit for the view to change, then open the form
			setTimeout(() => {
				createContext.openCreateForm();
			}, 100);
		} else {
			// If not on dashboard, navigate to dashboard and then trigger create
			window.location.href = "/dashboard";
		}
		setShowCreateDropdown(false);
	};

	const handleCreateLink = () => {
		handleCreateNew();
	};

	const handleCreateQR = () => {
		// TODO: Implement QR code creation
		setShowCreateDropdown(false);
	};

	const handleCreatePage = () => {
		// TODO: Implement page creation
		setShowCreateDropdown(false);
	};

	// Generate initials from username for avatar placeholder
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const userInitials = user?.username ? getInitials(user.username) : "U";

	return (
		<header className="fixed top-0 left-0 md:left-64 right-0 bg-white border-b border-gray-200 z-30 h-16">
			<div className="flex items-center justify-between px-4 h-full">
				{/* Left side - Menu button and greeting */}
				<div className="flex items-center space-x-4">
					<button
						onClick={onSidebarToggle}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 md:hidden"
					>
						<svg
							className="w-5 h-5 text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>

					<div className="hidden md:block">
						<h1 className="text-lg text-gray-600">
							<span className="text-yellow-500">☀️</span> Good morning,{" "}
							{user?.username || "User"}
						</h1>
						<p className="text-sm text-gray-500">Mon, July 22</p>
					</div>
				</div>

				{/* Right side - Create button, search, language, notifications, user */}
				<div className="flex items-center space-x-3">
					{/* Create New Dropdown */}
					<div className="relative" ref={createDropdownRef}>
						<button 
							onClick={() => setShowCreateDropdown(!showCreateDropdown)}
							className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
						>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
							Create new
							<svg
								className="w-4 h-4 ml-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{showCreateDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
								<button
									onClick={handleCreateLink}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg"
								>
									<svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
									</svg>
									<div>
										<div className="font-medium text-gray-900">Link</div>
										<div className="text-xs text-gray-500">Create a short URL</div>
									</div>
								</button>
								<button
									onClick={handleCreateQR}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
								>
									<svg className="w-4 h-4 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
									</svg>
									<div>
										<div className="font-medium text-gray-900">QR Code</div>
										<div className="text-xs text-gray-500">Generate QR code</div>
									</div>
								</button>
								<button
									onClick={handleCreatePage}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 last:rounded-b-lg"
								>
									<svg className="w-4 h-4 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
									</svg>
									<div>
										<div className="font-medium text-gray-900">Page</div>
										<div className="text-xs text-gray-500">Create a landing page</div>
									</div>
								</button>
							</div>
						)}
					</div>

					{/* Search */}
					<div className="relative hidden md:block">
						<input
							type="text"
							placeholder="Search links"
							className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<ICONS.SEARCH className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
					</div>

					{/* Language Dropdown */}
					<div className="relative hidden md:block">
						<button
							onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
							className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							{currentLanguage}
							<ICONS.DROP_DOWN />
						</button>

						{showLanguageDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
								{languages.map((language) => (
									<button
										key={language}
										onClick={() => handleLanguageSelect(language)}
										className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
									>
										{language}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Notifications */}
					<button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
						<svg
							className="w-5 h-5 text-gray-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-5 5v-5zm-8-2a4 4 0 118 0v3H7v-3z"
							/>
						</svg>
						{/* Notification badge */}
						<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
					</button>

					{/* User Avatar and Dropdown */}
					<div className="relative">
						<button
							onClick={() => setShowUserDropdown(!showUserDropdown)}
							className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
						>
							{/* Avatar placeholder */}
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
								{userInitials}
							</div>
							<span className="hidden md:block text-sm font-medium text-gray-700">
								{user?.username || "User"}
							</span>
							<svg
								className="w-4 h-4 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						{showUserDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
								<div className="px-4 py-3 border-b border-gray-200">
									<p className="text-sm font-medium text-gray-900">
										{user?.username || "User"}
									</p>
									<p className="text-sm text-gray-500">{user?.email || ""}</p>
								</div>
								<div className="py-1">
									<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
										👤 My account
									</button>
									<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
										🔔 Notifications
									</button>
									<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
										💳 Billing & Plan
									</button>
									<button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
										⚙️ Settings
									</button>
									<hr className="my-1" />
									<button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
										🚪 Sign out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
