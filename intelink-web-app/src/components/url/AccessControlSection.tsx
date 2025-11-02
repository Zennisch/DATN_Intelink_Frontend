import { useState } from "react";
import { CountrySelector } from "./CountrySelector";
import { IPRangeInput } from "./IPRangeInput";
import { AccessControlPreview } from "./AccessControlPreview";

export interface AccessControlData {
	mode: "allow" | "block";
	countries: string[];
	ipRanges: string[];
}

interface AccessControlSectionProps {
	data: AccessControlData;
	onChange: (data: AccessControlData) => void;
}

export const AccessControlSection = ({
	data,
	onChange,
}: AccessControlSectionProps) => {
	const [activeTab, setActiveTab] = useState<"geography" | "network">(
		"geography",
	);
	const [showMap, setShowMap] = useState(false);

	const handleModeChange = (mode: "allow" | "block") => {
		onChange({ ...data, mode });
	};

	const handleCountriesChange = (countries: string[]) => {
		onChange({ ...data, countries });
	};

	const handleIPRangesChange = (ipRanges: string[]) => {
		onChange({ ...data, ipRanges });
	};

	const hasRestrictions = data.countries.length > 0 || data.ipRanges.length > 0;

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="pb-3 border-b border-gray-200">
				<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
					Access Control
				</h3>
				<p className="text-xs text-gray-500 mt-1">
					Restrict access based on geographic location or IP address
				</p>
			</div>
			{/* Mode Selector - Compact Pills */}
			<div className="space-y-3">
				<label className="block text-sm font-medium text-gray-700">
					Access Mode
				</label>
				<div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
					<button
						type="button"
						onClick={() => handleModeChange("allow")}
						className={`
						flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
						${
							data.mode === "allow"
								? "bg-white text-green-700 shadow-sm ring-1 ring-green-600/20"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
						}
					`}
					>
						<i className="fas fa-check-circle"></i>
						<span>Allow Only</span>
					</button>
					<button
						type="button"
						onClick={() => handleModeChange("block")}
						className={`
						flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
						${
							data.mode === "block"
								? "bg-white text-red-700 shadow-sm ring-1 ring-red-600/20"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
						}
					`}
					>
						<i className="fas fa-ban"></i>
						<span>Block Specific</span>
					</button>
				</div>
				<p className="text-xs text-gray-500 leading-relaxed">
					{data.mode === "allow"
						? "✓ Whitelist mode: Only selected locations can access (more secure)"
						: "✗ Blacklist mode: Everyone can access except selected locations"}
				</p>
			</div>
			{/* Enhanced Tabs with Prominent Badges */}
			<div className="border-b border-gray-200">
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setActiveTab("geography")}
						className={`
						group relative px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
						${
							activeTab === "geography"
								? "border-blue-600 text-blue-700"
								: "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
						}
					`}
					>
						<span className="flex items-center gap-2">
							<i
								className={`fas fa-globe text-base ${activeTab === "geography" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
							></i>
							<span>Geography</span>
							{data.countries.length > 0 && (
								<span
									className={`
								inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold rounded-full
								transition-all duration-200
								${
									activeTab === "geography"
										? "bg-blue-600 text-white shadow-sm"
										: "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
								}
							`}
								>
									{data.countries.length}
								</span>
							)}
						</span>
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("network")}
						className={`
						group relative px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200
						${
							activeTab === "network"
								? "border-blue-600 text-blue-700"
								: "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
						}
					`}
					>
						<span className="flex items-center gap-2">
							<i
								className={`fas fa-network-wired text-base ${activeTab === "network" ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}
							></i>
							<span>IP/Network</span>
							{data.ipRanges.length > 0 && (
								<span
									className={`
								inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold rounded-full
								transition-all duration-200
								${
									activeTab === "network"
										? "bg-blue-600 text-white shadow-sm"
										: "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
								}
							`}
								>
									{data.ipRanges.length}
								</span>
							)}
						</span>
					</button>
				</div>
			</div>
			{/* Tab Content - Consistent Height */}
			<div className="py-1">
				{activeTab === "geography" ? (
					<CountrySelector
						selectedCountries={data.countries}
						onChange={handleCountriesChange}
					/>
				) : (
					<IPRangeInput
						ipRanges={data.ipRanges}
						onChange={handleIPRangesChange}
					/>
				)}
			</div>{" "}
			{/* Preview Section with Enhanced Header */}
			<div className="pt-5 border-t border-gray-200 space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<i className="fas fa-eye text-gray-400 text-sm"></i>
						<h4 className="text-sm font-semibold text-gray-900">
							Access Preview
						</h4>
					</div>
					{data.countries.length > 0 && (
						<button
							type="button"
							onClick={() => setShowMap(!showMap)}
							className={`
							flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md
							transition-all duration-200
							${
								showMap
									? "bg-blue-50 text-blue-700 hover:bg-blue-100"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}
						`}
						>
							<i
								className={`fas fa-${showMap ? "list" : "map-marked-alt"} text-sm`}
							></i>
							<span>{showMap ? "Hide Map" : "Show Map"}</span>
						</button>
					)}
				</div>
				<AccessControlPreview
					mode={data.mode}
					countries={data.countries}
					ipRanges={data.ipRanges}
					showMap={showMap}
				/>
			</div>
			{/* Quick Actions */}
			{hasRestrictions && (
				<div className="flex justify-end pt-2 border-t border-gray-100">
					<button
						type="button"
						onClick={() =>
							onChange({ mode: data.mode, countries: [], ipRanges: [] })
						}
						className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
					>
						<i className="fas fa-times-circle text-sm"></i>
						<span>Clear All Restrictions</span>
					</button>
				</div>
			)}
		</div>
	);
};
