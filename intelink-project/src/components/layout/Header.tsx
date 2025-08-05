import {useState} from 'react';
import icon from '../../assets/icon.png';

interface HeaderProps {
    onLanguageChange?: (language: string) => void;
}

export const Header: React.FC<HeaderProps> = ({onLanguageChange}) => {
    const [currentLanguage, setCurrentLanguage] = useState('English (United States)');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const languages = [
        'English (United States)',
        'Tiếng Việt (Vietnam)',
        '中文 (简体)',
        '日本語 (Japan)'
    ];

    const handleLanguageSelect = (language: string) => {
        setCurrentLanguage(language);
        setShowLanguageDropdown(false);
        onLanguageChange?.(language);
    };

    return (
        <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
                <img src={icon} alt="Intelink Logo" className="w-8 h-8"/>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </div>

                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        {currentLanguage}
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    {showLanguageDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Log in
                </button>
                <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Sign up
                </button>
            </div>
        </header>
    );
};
