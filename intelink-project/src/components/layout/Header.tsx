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
		<header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
			<div className="flex items-center">
				<img src={icon} alt="Intelink Logo" className="w-10 h-10" />
			</div>

			<div className="flex items-center space-x-4">
				<div className="relative">
					<input
						type="text"
						placeholder="Search"
						className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
					/>
					<ICONS.SEARCH className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
				</div>

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

				<button
					className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={handleLogin}
				>
					Log in
				</button>
				<button
					className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
					onClick={handleSignUp}
				>
					Sign up
				</button>
			</div>
		</header>
	);
};
