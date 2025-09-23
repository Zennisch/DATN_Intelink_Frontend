import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ICONS, LANGUAGES } from "../../types/constants.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";

interface AuthenticatedHeaderProps {
	onSidebarToggle: () => void;
	onLanguageChange: (language: string) => void;
}

export const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({
	onSidebarToggle,
	onLanguageChange,
}) => {	
	const { user } = useAuth();
	const navigate = useNavigate();
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

	const languages = Object.values(LANGUAGES);

	const handleLanguageSelect = (language: string) => {
		setCurrentLanguage(language);
		setShowLanguageDropdown(false);
		onLanguageChange(language);
	};

	const handleCreateLink = () => {
		navigate("/dashboard/short-urls");
		setShowCreateDropdown(false);
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
		const currentPlan = user?.currentSubscription?.planType || "No plan";
		const creditBalance = typeof user?.creditBalance === "number" ? user.creditBalance : 0;
		const currency = user?.currency || "VND";

	return (
			<header className="fixed top-0 left-0 md:left-64 right-0 bg-white border-b border-gray-200 z-30 h-16">
				<div className="flex items-center justify-between px-4 h-full">
				{/* Left side - Menu button and greeting */}
				<div className="flex items-center space-x-4">
					<Button
						onClick={onSidebarToggle}
						variant="secondary"
						size="sm"
						className="md:hidden"
						icon={<i className="fas fa-bars text-gray-600"></i>}
					>
						<span className="sr-only">Toggle sidebar</span>
					</Button>

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
						<Button
							onClick={() => setShowCreateDropdown(!showCreateDropdown)}
							variant="primary"
							size="sm"
							className="bg-blue-600 hover:bg-blue-700"
							icon={<i className="fas fa-plus"></i>}
						>
							Create new
							<i className="fas fa-chevron-down ml-2"></i>
						</Button>

						{showCreateDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
								<button
									onClick={handleCreateLink}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg"
								>
									<i className="fas fa-link w-4 h-4 mr-3 text-blue-500"></i>
									<div>
										<div className="font-medium text-gray-900">Link</div>
										<div className="text-xs text-gray-500">Create a short URL</div>
									</div>
								</button>
								<button
									onClick={handleCreateQR}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
								>
									<i className="fas fa-qrcode w-4 h-4 mr-3 text-green-500"></i>
									<div>
										<div className="font-medium text-gray-900">QR Code</div>
										<div className="text-xs text-gray-500">Generate QR code</div>
									</div>
								</button>
								<button
									onClick={handleCreatePage}
									className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 last:rounded-b-lg"
								>
									<i className="fas fa-file-alt w-4 h-4 mr-3 text-purple-500"></i>
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
						<Button
							onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
							variant="outline"
							size="sm"
						>
							{currentLanguage}
							<i className="fas fa-chevron-down ml-2"></i>
						</Button>

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
					<div className="relative">
						<Button
							variant="secondary"
							size="sm"
							className="relative"
							icon={<i className="fas fa-bell text-gray-600"></i>}
						>
							<span className="sr-only">Notifications</span>
						</Button>
						{/* Notification badge */}
						<span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full transform translate-x-1 -translate-y-1"></span>
					</div>

					{/* User Avatar and Dropdown */}
								<div className="relative flex items-center space-x-4">
									<Button
										onClick={() => setShowUserDropdown(!showUserDropdown)}
										variant="secondary"
										size="sm"
										className="flex items-center space-x-2"
										icon={
											<div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
												{userInitials}
											</div>
										}
									>
										<span className="hidden md:block text-sm font-medium text-gray-700">
											{user?.username || "User"}
										</span>
										<i className="fas fa-chevron-down text-gray-400 ml-1"></i>
									</Button>
									{/* Subscription & Credit */}
									<div className="hidden md:flex flex-col items-end text-xs">
										<div className="flex items-center space-x-2">
											<span className="font-semibold text-blue-600">{currentPlan}</span>
											<span className="text-gray-400">|</span>
											<span className="font-semibold text-green-600">{creditBalance} {currency}</span>
										</div>
										<span className="text-gray-500">Plan & Credit</span>
									</div>
									{/* End Subscription & Credit */}
									{showUserDropdown && (
										<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
											<div className="px-4 py-3 border-b border-gray-200">
												<p className="text-sm font-medium text-gray-900">
													{user?.username || "User"}
												</p>
												<p className="text-sm text-gray-500">{user?.email || ""}</p>
												<p className="text-xs mt-1"><span className="font-semibold text-blue-600">{currentPlan}</span> | <span className="font-semibold text-green-600">{creditBalance} {currency}</span></p>
											</div>
											<div className="py-1">
												<button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
													<i className="fas fa-user w-4 mr-3"></i>
													My account
												</button>
												<button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
													<i className="fas fa-bell w-4 mr-3"></i>
													Notifications
												</button>
												<button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
													<i className="fas fa-credit-card w-4 mr-3"></i>
													Billing & Plan
												</button>
												<button className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
													<i className="fas fa-cog w-4 mr-3"></i>
													Settings
												</button>
												<hr className="my-1" />
												<button className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
													<i className="fas fa-sign-out-alt w-4 mr-3"></i>
													Sign out
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
