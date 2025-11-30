import React, { useState } from "react";
import icon from "../../assets/icon.png";
import { ICONS, LANGUAGES } from "../../types/constants.ts";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
	onLanguageChange?: (language: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLanguageChange }) => {
	const navigate = useNavigate();
	const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.EN);
	const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const languages = Object.values(LANGUAGES);

	const handleLanguageSelect = (language: string) => {
		setCurrentLanguage(language);
		setShowLanguageDropdown(false);
		onLanguageChange?.(language);
	};

	const handleLogin = () => {
		navigate("/login");
	};

	const handleSignUp = () => {
		navigate("/register");
	};

	return (
		<header className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-sm z-50">
			{/* Logo */}
			<div className="flex items-center">
				<img src={icon} alt="Intelink Logo" className="w-8 h-8 md:w-10 md:h-10" />
				<span className="ml-2 text-lg md:text-xl font-bold text-gray-900 hidden sm:block">Intelink</span>
			</div>

			{/* Desktop Navigation */}
			<div className="hidden lg:flex items-center space-x-3">
				{/* Search */}
				<div className="relative">
					<input
						type="text"
						placeholder="Search"
						className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-48 xl:w-64"
					/>
					<ICONS.SEARCH className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
				</div>

				{/* Language Dropdown */}
				<div className="relative">
					<button
						onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
						className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
					>
						{currentLanguage}
						<ICONS.DROP_DOWN />
					</button>

					{showLanguageDropdown && (
						<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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

				{/* Auth Buttons */}
				<button
					className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
					onClick={handleLogin}
				>
					Log in
				</button>
				<button
					className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
					onClick={handleSignUp}
				>
					Sign up
				</button>
			</div>

			{/* Mobile/Tablet - Auth Buttons */}
			<div className="flex lg:hidden items-center space-x-2">
				<button
					className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={handleLogin}
				>
					Log in
				</button>
				<button
					className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={handleSignUp}
				>
					Sign up
				</button>
				{/* Hamburger Menu Button */}
				<button
					onClick={() => setShowMobileMenu(!showMobileMenu)}
					className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
				>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{showMobileMenu ? (
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
			</div>

			{/* Mobile Menu Dropdown */}
			{showMobileMenu && (
				<div className="absolute top-full left-0 right-0 mt-1 bg-white border-t border-gray-200 shadow-lg lg:hidden">
					<div className="p-4 space-y-3">
						{/* Search */}
						<div className="relative">
							<input
								type="text"
								placeholder="Search"
								className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
							/>
							<ICONS.SEARCH className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
						</div>

						{/* Language Selection */}
						<div className="border-t border-gray-200 pt-3">
							<p className="text-xs font-medium text-gray-500 mb-2">Language</p>
							<div className="grid grid-cols-2 gap-2">
								{languages.map((language) => (
									<button
										key={language}
										onClick={() => {
											handleLanguageSelect(language);
											setShowMobileMenu(false);
										}}
										className={`px-3 py-2 text-sm rounded-lg border ${
											currentLanguage === language
												? 'bg-gray-900 text-white border-gray-900'
												: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
										}`}
									>
										{language}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
};
