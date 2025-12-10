import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import TextInput from "./atoms/TextInput";
import Button from "./atoms/Button";
import {
	getIPValidationError,
	formatCIDRSize,
	isValidCIDR,
} from "../utils/ipValidation";

interface IPRangeInputProps {
	ipRanges: string[];
	onChange: (ranges: string[]) => void;
	disabled?: boolean;
}

export const IPRangeInput: React.FC<IPRangeInputProps> = ({
	ipRanges,
	onChange,
	disabled = false,
}) => {
	const [currentInput, setCurrentInput] = useState("");
	const [error, setError] = useState<string | undefined>();

	const handleAdd = () => {
		const trimmed = currentInput.trim();
		if (!trimmed) return;

		const validationError = getIPValidationError(trimmed);
		if (validationError) {
			setError(validationError);
			return;
		}

		// Check for duplicates
		if (ipRanges.includes(trimmed)) {
			setError("This IP/CIDR is already added");
			return;
		}

		onChange([...ipRanges, trimmed]);
		setCurrentInput("");
		setError(undefined);
	};

	const handleRemove = (index: number) => {
		onChange(ipRanges.filter((_, i) => i !== index));
	};

	return (
		<View className="mb-2">
			<Text className="text-sm font-medium text-gray-700 mb-2">
				IP / CIDR Ranges
			</Text>

			{/* Input Section */}
			<View className="mb-2">
				<TextInput
					placeholder="192.168.1.0/24 or 10.0.0.1"
					value={currentInput}
					onChangeText={(value) => {
						setCurrentInput(value);
						setError(undefined);
					}}
					error={error}
					fullWidth
					editable={!disabled}
					autoCapitalize="none"
				/>
			</View>

			{/* Add Button */}
			<View className="mb-2">
				<Button
					onPress={handleAdd}
					variant="secondary"
					disabled={!currentInput.trim() || disabled}
				>
					Add IP/Range
				</Button>
			</View>

			{/* Help Text */}
			<Text className="text-xs text-gray-500 mb-2">
				e.g., 192.168.1.1 or 192.168.1.0/24
			</Text>

			{/* List of added ranges */}
			{ipRanges.length > 0 && (
				<View className="mt-2">
					<Text className="text-xs font-medium text-gray-700 mb-1.5">
						Added ({ipRanges.length}):
					</Text>
					<ScrollView
						className="max-h-32 bg-gray-50 rounded-lg p-2"
						nestedScrollEnabled
						showsVerticalScrollIndicator={true}
						persistentScrollbar={true}
						indicatorStyle="black"
					>
						{ipRanges.map((range, index) => {
							const isCIDR = isValidCIDR(range);
							const sizeText = isCIDR ? formatCIDRSize(range) : "";

							return (
								<View
									key={index}
									className="flex-row items-center justify-between bg-white rounded-lg p-2 mb-1.5 border border-gray-200"
								>
									<View className="flex-1 mr-2">
										<Text className="text-xs font-mono text-gray-900">
											{range}
										</Text>
										{sizeText && (
											<Text className="text-xs text-gray-500 mt-0.5">
												{sizeText}
											</Text>
										)}
									</View>
									<TouchableOpacity
										onPress={() => handleRemove(index)}
										disabled={disabled}
										className="bg-red-50 rounded-full w-7 h-7 items-center justify-center"
									>
										<Text className="text-red-600 text-base">×</Text>
									</TouchableOpacity>
								</View>
							);
						})}
					</ScrollView>
				</View>
			)}
		</View>
	);
};
