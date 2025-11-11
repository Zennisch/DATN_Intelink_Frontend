import { forwardRef, ReactNode, useMemo } from 'react';
import { Text, TextInput as TextInputBase, TextInputProps, View } from 'react-native';

type TextInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type TextInputState = 'default' | 'error' | 'success' | 'disabled';

interface Props extends TextInputProps {
	label?: ReactNode;
	error?: ReactNode;
	helpText?: ReactNode;
	size?: TextInputSize;
	state?: TextInputState;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	wrapperClassName?: string;
	inputClassName?: string;
	labelClassName?: string;
	errorClassName?: string;
	helpTextClassName?: string;
	fullWidth?: boolean;
	borderless?: boolean;
	disabled?: boolean;
	important?: boolean;
	srOnlyLabel?: boolean;
}

interface SizeProps {
	input: string;
	text: string;
	icon: string;
}

const sizeClasses: Record<TextInputSize, SizeProps> = {
	xs: {
		input: 'px-2 py-1 text-xs',
		text: 'text-xs',
		icon: 'w-2 h-2',
	},
	sm: {
		input: 'px-3 py-1.5 text-sm',
		text: 'text-sm',
		icon: 'w-3 h-3',
	},
	md: {
		input: 'px-4 py-2 text-base',
		text: 'text-sm',
		icon: 'w-4 h-4',
	},
	lg: {
		input: 'px-5 py-2.5 text-lg',
		text: 'text-base',
		icon: 'w-5 h-5',
	},
	xl: {
		input: 'px-6 py-3 text-xl',
		text: 'text-lg',
		icon: 'w-6 h-6',
	},
};

const stateClasses = {
	default: 'border-gray-500 bg-white',
	error: 'border-red-500 bg-white',
	success: 'border-green-500 bg-white',
	disabled: 'border-gray-200 bg-gray-100',
};

const TextInput = forwardRef<React.ComponentRef<typeof TextInputBase>, Props>(
	(
		{
			label,
			error,
			helpText,
			size = 'md',
			state = 'default',
			leftIcon,
			rightIcon,
			wrapperClassName = '',
			inputClassName = '',
			labelClassName = '',
			errorClassName = '',
			helpTextClassName = '',
			fullWidth = false,
			disabled = false,
			borderless = false,
			important = false,
			srOnlyLabel = false,
			...props
		},
		ref
	) => {
		const currentState: TextInputState = useMemo(() => {
			if (disabled) return 'disabled';
			if (error) return 'error';
			return state;
		}, [disabled, error, state]);

		const containerClasses = useMemo(() => {
			if (borderless)
				return `flex flex-row items-center 
					${fullWidth ? 'w-full' : ''}`;
			else
				return `flex flex-row items-center 
					border rounded-lg 
					${stateClasses[currentState]} 
					${fullWidth ? 'w-full' : ''}`;
		}, [borderless, currentState, fullWidth]);

		const inputClasses = useMemo(() => {
			return `
				flex-1 text-black placeholder-gray-500
				${sizeClasses[size].input}
				${inputClassName}`;
		}, [size, inputClassName]);

		return (
			<View className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
				{label && (
					<View className={`flex-row items-center px-1 ${srOnlyLabel ? 'sr-only' : ''}`}>
						{typeof label === 'string' ? (
							<Text className={`${sizeClasses[size].text} text-gray-700 ${labelClassName}`}>{label}</Text>
						) : (
							<View className={labelClassName}>{label}</View>
						)}
						{important && <Text className="text-red-500 ml-1">*</Text>}
					</View>
				)}

				<View className={`${containerClasses}`}>
					{leftIcon && (
						<View className={`justify-center items-center ml-2 ${sizeClasses[size].icon}`}>{leftIcon}</View>
					)}

					<TextInputBase ref={ref} className={inputClasses} editable={!disabled} {...props} />

					{rightIcon && (
						<View className={`justify-center items-center mr-2 ${sizeClasses[size].icon}`}>{rightIcon}</View>
					)}
				</View>

				{helpText &&
					!error &&
					(typeof helpText === 'string' ? (
						<Text className={`p-1 text-sm text-gray-500 ${helpTextClassName}`}>{helpText}</Text>
					) : (
						<View className={`p-1 text-sm ${helpTextClassName}`}>{helpText}</View>
					))}

				{error &&
					(typeof error === 'string' ? (
						<Text className={`p-1 text-sm text-red-600 ${errorClassName}`}>{error}</Text>
					) : (
						<View className={`p-1 text-sm ${errorClassName}`}>{error}</View>
					))}
			</View>
		);
	}
);

TextInput.displayName = 'TextInput';

export default TextInput;
