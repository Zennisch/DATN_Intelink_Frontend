import React, { forwardRef, memo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
	id?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	color?: string;
	size?: number;
	className?: string;
}

const Checkbox = forwardRef<React.ComponentRef<typeof TouchableOpacity>, CheckboxProps>(
	(
		{
			id,
			checked,
			onChange,
			label,
			disabled = false,
			color = '#6B7280',
			size = 20,
			className = '',
			...props
		},
		ref
	) => {
		const handlePress = () => {
			if (!disabled) {
				onChange(!checked);
			}
		};

		return (
			<TouchableOpacity
				ref={ref}
				onPress={handlePress}
				disabled={disabled}
				className={`flex-row items-center ${disabled ? 'opacity-50' : ''} ${className}`}
				{...props}
			>
				<View
					className={`border-2 rounded ${
						checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
					} items-center justify-center`}
					style={{ width: size, height: size }}
				>
					{checked && (
						<Ionicons
							name="checkmark"
							size={size * 0.7}
							color="white"
						/>
					)}
				</View>
				{label && (
					<View className="ml-2">
						<Text className="text-gray-700">{label}</Text>
					</View>
				)}
			</TouchableOpacity>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export default memo(Checkbox);
