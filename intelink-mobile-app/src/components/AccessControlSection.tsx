import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CountryPicker } from "./CountryPicker";
import { IPRangeInput } from "./IPRangeInput";

export interface AccessControlData {
	mode: "allow" | "block";
	countries: string[];
	ipRanges: string[];
}

interface AccessControlSectionProps {
	data: AccessControlData;
	onChange: (data: AccessControlData) => void;
}

export const AccessControlSection: React.FC<AccessControlSectionProps> = ({
	data,
	onChange,
}) => {
	const [activeTab, setActiveTab] = useState<"geography" | "network">("geography");

	const handleModeChange = (mode: "allow" | "block") => {
		try {
			onChange({ ...data, mode });
		} catch (error) {
			console.warn('[AccessControlSection] Error changing mode:', error);
		}
	};

	const handleCountriesChange = (countries: string[]) => {
		onChange({ ...data, countries });
	};

	const handleIPRangesChange = (ipRanges: string[]) => {
		onChange({ ...data, ipRanges });
	};

	return (
		<View className="mb-2">
			{/* Header */}
			<View className="pb-2 mb-2">
				<Text className="text-sm font-semibold text-gray-900">
					Access Control
				</Text>
				<Text className="text-xs text-gray-500 mt-1">
					Restrict access by location or IP
				</Text>
			</View>

			{/* Mode Selector */}
			<View className="mb-3">
				<Text className="text-sm font-medium text-gray-700 mb-2">
					Access Mode
				</Text>
				<View className="flex-row bg-gray-100 rounded-lg p-1">
					<TouchableOpacity
						onPress={() => handleModeChange("allow")}
						className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-md ${
							data.mode === "allow"
								? "bg-white shadow-sm"
								: ""
						}`}
					>
						<Text
							className={`text-sm font-medium ${
								data.mode === "allow"
									? "text-green-700"
									: "text-gray-600"
							}`}
						>
							✓ Allow Only
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleModeChange("block")}
						className={`flex-1 flex-row items-center justify-center py-3 px-3 rounded-md ${
							data.mode === "block"
								? "bg-white shadow-sm"
								: ""
						}`}
					>
						<Text
							className={`text-sm font-medium ${
								data.mode === "block"
									? "text-red-700"
									: "text-gray-600"
							}`}
						>
							✗ Block Specific
						</Text>
					</TouchableOpacity>
				</View>
				<Text className="text-xs text-gray-500 mt-1.5">
					{data.mode === "allow"
						? "✓ Only selected can access"
						: "✗ Everyone except selected"}
				</Text>
			</View>

			{/* Tabs */}
			<View className="flex-row border-b border-gray-200 mb-3">
				<TouchableOpacity
					onPress={() => setActiveTab("geography")}
					className={`flex-1 pb-3 ${
						activeTab === "geography"
							? "border-b-2 border-blue-600"
							: ""
					}`}
				>
					<View className="flex-row items-center justify-center">
						<Text
							className={`text-sm font-medium mr-2 ${
								activeTab === "geography"
									? "text-blue-700"
									: "text-gray-600"
							}`}
						>
							🌍 Geography
						</Text>
						{data.countries.length > 0 && (
							<View
								className={`rounded-full px-2 py-0.5 min-w-5 ${
									activeTab === "geography"
										? "bg-blue-600"
										: "bg-gray-200"
								}`}
							>
								<Text
									className={`text-xs font-semibold text-center ${
										activeTab === "geography"
											? "text-white"
											: "text-gray-700"
									}`}
								>
									{data.countries.length}
								</Text>
							</View>
						)}
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => setActiveTab("network")}
					className={`flex-1 pb-3 ${
						activeTab === "network"
							? "border-b-2 border-blue-600"
							: ""
					}`}
				>
					<View className="flex-row items-center justify-center">
						<Text
							className={`text-sm font-medium mr-2 ${
								activeTab === "network"
									? "text-blue-700"
									: "text-gray-600"
							}`}
						>
							🌐 IP/Network
						</Text>
						{data.ipRanges.length > 0 && (
							<View
								className={`rounded-full px-2 py-0.5 min-w-5 ${
									activeTab === "network"
										? "bg-blue-600"
										: "bg-gray-200"
								}`}
							>
								<Text
									className={`text-xs font-semibold text-center ${
										activeTab === "network"
											? "text-white"
											: "text-gray-700"
									}`}
								>
									{data.ipRanges.length}
								</Text>
							</View>
						)}
					</View>
				</TouchableOpacity>
			</View>

			{/* Tab Content */}
			<View>
				{activeTab === "geography" ? (
					<CountryPicker
						selectedCountries={data.countries}
						onChange={handleCountriesChange}
					/>
				) : (
					<IPRangeInput
						ipRanges={data.ipRanges}
						onChange={handleIPRangesChange}
					/>
				)}
			</View>

			{/* Summary */}
			{(data.countries.length > 0 || data.ipRanges.length > 0) && (
				<View className="mt-3 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
					<Text className="text-xs font-semibold text-blue-900 mb-0.5">
						Summary
					</Text>
					<Text className="text-xs text-blue-700">
						{data.mode === "allow" ? "Allow" : "Block"}{" "}
						{data.countries.length > 0 &&
							`${data.countries.length} ${
								data.countries.length === 1 ? "country" : "countries"
							}`}
						{data.countries.length > 0 && data.ipRanges.length > 0 && " + "}
						{data.ipRanges.length > 0 &&
							`${data.ipRanges.length} IP`}
					</Text>
				</View>
			)}
		</View>
	);
};
