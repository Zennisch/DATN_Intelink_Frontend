import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, PanResponder, Animated, ScrollView } from "react-native";
import TextInput from "./atoms/TextInput";
import Button from "./atoms/Button";
import { countries, searchCountries, type Country } from "../utils/countries";

interface CountryPickerProps {
	selectedCountries: string[];
	onChange: (countries: string[]) => void;
	disabled?: boolean;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
	selectedCountries,
	onChange,
	disabled = false,
}) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const translateY = useRef(new Animated.Value(0)).current;

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) => {
				return gestureState.dy > 5;
			},
			onMoveShouldSetPanResponderCapture: (_, gestureState) => {
				return gestureState.dy > 5;
			},
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					translateY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 150) {
					Animated.timing(translateY, {
						toValue: 1000,
						duration: 300,
						useNativeDriver: true,
					}).start(() => {
						setModalVisible(false);
						translateY.setValue(0);
					});
				} else {
					Animated.spring(translateY, {
						toValue: 0,
						useNativeDriver: true,
					}).start();
				}
			},
		})
	).current;

	const filteredCountries = useMemo(() => {
		if (!searchQuery.trim()) return countries;
		return searchCountries(searchQuery);
	}, [searchQuery]);

	const handleToggleCountry = (countryCode: string) => {
		if (selectedCountries.includes(countryCode)) {
			onChange(selectedCountries.filter((c) => c !== countryCode));
		} else {
			onChange([...selectedCountries, countryCode]);
		}
	};

	const handleRemoveCountry = (countryCode: string) => {
		onChange(selectedCountries.filter((c) => c !== countryCode));
	};

	const selectedCountryObjects = useMemo(() => {
		return countries.filter((c: Country) => selectedCountries.includes(c.code));
	}, [selectedCountries]);

	const renderCountryItem = ({ item }: { item: Country }) => {
		const isSelected = selectedCountries.includes(item.code);
		return (
			<TouchableOpacity
				className={`flex-row items-center justify-between p-3 border-b border-gray-200 ${
					isSelected ? "bg-blue-50" : "bg-white"
				}`}
				onPress={() => handleToggleCountry(item.code)}
			>
				<View className="flex-row items-center flex-1">
					<Text className="text-2xl mr-3">{item.flag}</Text>
					<Text className={`text-base ${isSelected ? "font-semibold text-blue-700" : "text-gray-900"}`}>
						{item.name}
					</Text>
				</View>
				{isSelected && (
					<View className="bg-blue-600 rounded-full w-6 h-6 items-center justify-center">
						<Text className="text-white text-xs">✓</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	};

	return (
		<View className="mb-2">
			<Text className="text-sm font-medium text-gray-700 mb-2">Countries</Text>
			
			{/* Selected Countries Display */}
			{selectedCountryObjects.length > 0 && (
				<ScrollView 
					horizontal 
					showsHorizontalScrollIndicator={false}
					className="mb-2"
					contentContainerStyle={{ gap: 8 }}
				>
					{selectedCountryObjects.map((country: Country) => (
						<View
							key={country.code}
							className="bg-gray-100 rounded-lg px-2.5 py-1.5 flex-row items-center"
						>
							<Text className="text-sm mr-1.5">{country.flag}</Text>
							<Text className="text-xs text-gray-700 mr-1.5">{country.name}</Text>
							<TouchableOpacity
								onPress={() => handleRemoveCountry(country.code)}
								disabled={disabled}
							>
								<Text className="text-gray-500 text-base">×</Text>
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
			)}

			{/* Select Button */}
			<Button
				onPress={() => setModalVisible(true)}
				variant="secondary"
				disabled={disabled}
			>
				{selectedCountries.length > 0
					? `${selectedCountries.length} Selected - Add More`
					: "Select Countries"}
			</Button>

			{/* Country Selection Modal */}
			<Modal
				visible={modalVisible}
				animationType="slide"
				transparent={false}
			onRequestClose={() => setModalVisible(false)}
		>
				<Animated.View 
					className="flex-1 bg-white"
					style={{ transform: [{ translateY }] }}
				>
						{/* Drag Handle */}
						<View className="items-center py-3 border-b border-gray-100">
							<View {...panResponder.panHandlers} className="py-2 px-10">
								<View className="w-12 h-1 bg-gray-300 rounded-full" />
							</View>
						</View>
					
					{/* Modal Header */}
					<View className="px-4 pt-2 pb-3 border-b border-gray-200">
							<View className="flex-row justify-between items-center mb-3">
								<Text className="text-lg font-semibold text-gray-900">
									Select Countries
								</Text>
								<TouchableOpacity
									onPress={() => setModalVisible(false)}
									className="bg-gray-100 rounded-full w-8 h-8 items-center justify-center"
								>
									<Text className="text-gray-600 text-xl">×</Text>
								</TouchableOpacity>
							</View>
							
							{/* Search Input */}
							<TextInput
								placeholder="Search countries..."
								value={searchQuery}
								onChangeText={setSearchQuery}
								fullWidth
								autoCapitalize="none"
							/>
							
							{/* Selected Count */}
							{selectedCountries.length > 0 && (
								<View className="mt-2 flex-row items-center">
									<View className="bg-blue-100 rounded-full px-3 py-1">
										<Text className="text-blue-700 text-xs font-semibold">
											{selectedCountries.length} selected
										</Text>
									</View>
								</View>
							)}
						</View>

					{/* Country List */}
					<FlatList
						data={filteredCountries}
						renderItem={renderCountryItem}
						keyExtractor={(item) => item.code}
						showsVerticalScrollIndicator={true}
						persistentScrollbar={true}
						indicatorStyle="black"
						scrollIndicatorInsets={{ right: 1 }}
						bounces={true}
						scrollEnabled={true}
						nestedScrollEnabled={true}
						ListEmptyComponent={
								<View className="p-8 items-center">
									<Text className="text-gray-500 text-center">
										No countries found matching &quot;{searchQuery}&quot;
									</Text>
								</View>
							}
						/>

					{/* Modal Footer */}
					<View className="px-4 py-3 border-t border-gray-200">
						<Button
							onPress={() => setModalVisible(false)}
							variant="primary"
						>
							Done
						</Button>
					</View>
				</Animated.View>
			</Modal>
		</View>
	);
};
