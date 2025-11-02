import {getCountryByCode} from '../../utils/countries';
import {WorldMapPreview} from './WorldMapPreview';

interface AccessControlPreviewProps {
	mode: 'allow' | 'block';
	countries: string[];
	ipRanges: string[];
	showMap?: boolean;
}

export const AccessControlPreview = ({mode, countries, ipRanges, showMap = false}: AccessControlPreviewProps) => {
	const hasCountries = countries.length > 0;
	const hasIPs = ipRanges.length > 0;
	const hasRestrictions = hasCountries || hasIPs;

	if (!hasRestrictions) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
				<div className="flex items-start gap-3">
					<i className="fas fa-globe text-gray-400 text-lg mt-0.5"></i>
					<div>
						<p className="text-sm font-medium text-gray-700">No Restrictions</p>
						<p className="text-xs text-gray-500 mt-1">
							This link can be accessed from anywhere in the world
						</p>
					</div>
				</div>
			</div>
		);
	}

	const isAllow = mode === 'allow';

	return (
		<div
			className={`rounded-lg border p-4 ${
				isAllow ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
			}`}
		>
			<div className="flex items-start gap-3">
				<i
					className={`fas ${isAllow ? 'fa-shield-check text-green-600' : 'fa-shield-xmark text-red-600'} text-lg mt-0.5`}
				></i>
				<div className="flex-1 min-w-0">
					<p className={`text-sm font-semibold ${isAllow ? 'text-green-900' : 'text-red-900'}`}>
						{isAllow ? '🔒 Whitelist Mode (Allow Only)' : '🚫 Blacklist Mode (Block)'}
					</p>
					<p className={`text-xs mt-1 ${isAllow ? 'text-green-700' : 'text-red-700'}`}>
						{isAllow
							? 'Only selected locations can access this link'
							: 'Everyone can access except selected locations'}
					</p>

					<div className="mt-3 space-y-2">
						{/* Countries Summary */}
						{hasCountries && (
							<div className="flex items-start gap-2">
								<i className="fas fa-map-marker-alt text-xs text-gray-500 mt-1"></i>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-700">
										{countries.length} {countries.length === 1 ? 'Country' : 'Countries'}:
									</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{countries.slice(0, 5).map((code) => {
											const country = getCountryByCode(code);
											return (
												<span
													key={code}
													className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200"
													title={country?.name}
												>
													{country?.flag} {country?.name}
												</span>
											);
										})}
										{countries.length > 5 && (
											<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200 text-gray-600">
												+{countries.length - 5} more
											</span>
										)}
									</div>
								</div>
							</div>
						)}

						{/* IP Ranges Summary */}
						{hasIPs && (
							<div className="flex items-start gap-2">
								<i className="fas fa-network-wired text-xs text-gray-500 mt-1"></i>
								<div className="flex-1 min-w-0">
									<p className="text-xs font-medium text-gray-700">
										{ipRanges.length} IP {ipRanges.length === 1 ? 'Range' : 'Ranges'}:
									</p>
									<div className="flex flex-wrap gap-1 mt-1">
										{ipRanges.slice(0, 3).map((range, idx) => (
											<code
												key={idx}
												className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200 font-mono"
											>
												{range}
											</code>
										))}
										{ipRanges.length > 3 && (
											<span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white border border-gray-200 text-gray-600">
												+{ipRanges.length - 3} more
											</span>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* World Map Preview - only show if enabled and countries are selected */}
			{showMap && hasCountries && (
				<div className="mt-6">
					<WorldMapPreview
						selectedCountries={countries}
						mode={mode}
					/>
				</div>
			)}
		</div>
	);
};
