export interface Country {
	code: string;
	name: string;
	flag: string;
}

// Comprehensive list of countries with their ISO codes and flags
export const countries: Country[] = [
	{ code: "AF", name: "Afghanistan", flag: "🇦🇫" },
	{ code: "AL", name: "Albania", flag: "🇦🇱" },
	{ code: "DZ", name: "Algeria", flag: "🇩🇿" },
	{ code: "AR", name: "Argentina", flag: "🇦🇷" },
	{ code: "AM", name: "Armenia", flag: "🇦🇲" },
	{ code: "AU", name: "Australia", flag: "🇦🇺" },
	{ code: "AT", name: "Austria", flag: "🇦🇹" },
	{ code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
	{ code: "BD", name: "Bangladesh", flag: "🇧🇩" },
	{ code: "BY", name: "Belarus", flag: "🇧🇾" },
	{ code: "BE", name: "Belgium", flag: "🇧🇪" },
	{ code: "BR", name: "Brazil", flag: "🇧🇷" },
	{ code: "BG", name: "Bulgaria", flag: "🇧🇬" },
	{ code: "KH", name: "Cambodia", flag: "🇰🇭" },
	{ code: "CA", name: "Canada", flag: "🇨🇦" },
	{ code: "CL", name: "Chile", flag: "🇨🇱" },
	{ code: "CN", name: "China", flag: "🇨🇳" },
	{ code: "CO", name: "Colombia", flag: "🇨🇴" },
	{ code: "HR", name: "Croatia", flag: "🇭🇷" },
	{ code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
	{ code: "DK", name: "Denmark", flag: "🇩🇰" },
	{ code: "EG", name: "Egypt", flag: "🇪🇬" },
	{ code: "EE", name: "Estonia", flag: "🇪🇪" },
	{ code: "FI", name: "Finland", flag: "🇫🇮" },
	{ code: "FR", name: "France", flag: "🇫🇷" },
	{ code: "DE", name: "Germany", flag: "🇩🇪" },
	{ code: "GR", name: "Greece", flag: "🇬🇷" },
	{ code: "HK", name: "Hong Kong", flag: "🇭🇰" },
	{ code: "HU", name: "Hungary", flag: "🇭🇺" },
	{ code: "IS", name: "Iceland", flag: "🇮🇸" },
	{ code: "IN", name: "India", flag: "🇮🇳" },
	{ code: "ID", name: "Indonesia", flag: "🇮🇩" },
	{ code: "IR", name: "Iran", flag: "🇮🇷" },
	{ code: "IQ", name: "Iraq", flag: "🇮🇶" },
	{ code: "IE", name: "Ireland", flag: "🇮🇪" },
	{ code: "IL", name: "Israel", flag: "🇮🇱" },
	{ code: "IT", name: "Italy", flag: "🇮🇹" },
	{ code: "JP", name: "Japan", flag: "🇯🇵" },
	{ code: "JO", name: "Jordan", flag: "🇯🇴" },
	{ code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
	{ code: "KE", name: "Kenya", flag: "🇰🇪" },
	{ code: "KR", name: "South Korea", flag: "🇰🇷" },
	{ code: "KW", name: "Kuwait", flag: "🇰🇼" },
	{ code: "LA", name: "Laos", flag: "🇱🇦" },
	{ code: "LV", name: "Latvia", flag: "🇱🇻" },
	{ code: "LT", name: "Lithuania", flag: "🇱🇹" },
	{ code: "MY", name: "Malaysia", flag: "🇲🇾" },
	{ code: "MX", name: "Mexico", flag: "🇲🇽" },
	{ code: "MM", name: "Myanmar", flag: "🇲🇲" },
	{ code: "NL", name: "Netherlands", flag: "🇳🇱" },
	{ code: "NZ", name: "New Zealand", flag: "🇳🇿" },
	{ code: "NG", name: "Nigeria", flag: "🇳🇬" },
	{ code: "NO", name: "Norway", flag: "🇳🇴" },
	{ code: "PK", name: "Pakistan", flag: "🇵🇰" },
	{ code: "PE", name: "Peru", flag: "🇵🇪" },
	{ code: "PH", name: "Philippines", flag: "🇵🇭" },
	{ code: "PL", name: "Poland", flag: "🇵🇱" },
	{ code: "PT", name: "Portugal", flag: "🇵🇹" },
	{ code: "QA", name: "Qatar", flag: "🇶🇦" },
	{ code: "RO", name: "Romania", flag: "🇷🇴" },
	{ code: "RU", name: "Russia", flag: "🇷🇺" },
	{ code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
	{ code: "SG", name: "Singapore", flag: "🇸🇬" },
	{ code: "SK", name: "Slovakia", flag: "🇸🇰" },
	{ code: "SI", name: "Slovenia", flag: "🇸🇮" },
	{ code: "ZA", name: "South Africa", flag: "🇿🇦" },
	{ code: "ES", name: "Spain", flag: "🇪🇸" },
	{ code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
	{ code: "SE", name: "Sweden", flag: "🇸🇪" },
	{ code: "CH", name: "Switzerland", flag: "🇨🇭" },
	{ code: "TW", name: "Taiwan", flag: "🇹🇼" },
	{ code: "TH", name: "Thailand", flag: "🇹🇭" },
	{ code: "TR", name: "Turkey", flag: "🇹🇷" },
	{ code: "UA", name: "Ukraine", flag: "🇺🇦" },
	{ code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
	{ code: "GB", name: "United Kingdom", flag: "🇬🇧" },
	{ code: "US", name: "United States", flag: "🇺🇸" },
	{ code: "UY", name: "Uruguay", flag: "🇺🇾" },
	{ code: "VN", name: "Vietnam", flag: "🇻🇳" },
	{ code: "YE", name: "Yemen", flag: "🇾🇪" },
];

export const getCountryByCode = (code: string): Country | undefined => {
	return countries.find((c) => c.code === code);
};

export const searchCountries = (query: string): Country[] => {
	const lowerQuery = query.toLowerCase();
	return countries.filter(
		(c) =>
			c.name.toLowerCase().includes(lowerQuery) ||
			c.code.toLowerCase().includes(lowerQuery)
	);
};
