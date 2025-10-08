import { forwardRef, ReactNode, useMemo } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonInputState = 'default' | 'error' | 'success' | 'disabled';

interface Props extends Omit<TouchableOpacityProps, 'children'> {
	label?: ReactNode;
	error?: ReactNode;
	helpText?: ReactNode;
	size?: ButtonInputSize;
	state?: ButtonInputState;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	wrapperClassName?: string;
	buttonClassName?: string;
	labelClassName?: string;
	errorClassName?: string;
	helpTextClassName?: string;
	fullWidth?: boolean;
	borderless?: boolean;
	disabled?: boolean;
	important?: boolean;
	srOnlyLabel?: boolean;
	placeholder?: string;
	value?: string;
}

interface SizeProps {
	button: string;
	text: string;
	icon: string;
}

const sizeClasses: Record<ButtonInputSize, SizeProps> = {
	xs: {
		button: 'px-2 py-1 text-xs',
		text: 'text-xs',
		icon: 'w-2 h-2',
	},
	sm: {
		button: 'px-3 py-1.5 text-sm',
		text: 'text-sm',
		icon: 'w-3 h-3',
	},
	md: {
		button: 'px-4 py-2 text-base',
		text: 'text-sm',
		icon: 'w-4 h-4',
	},
	lg: {
		button: 'px-5 py-2.5 text-lg',
		text: 'text-base',
		icon: 'w-5 h-5',
	},
	xl: {
		button: 'px-6 py-3 text-xl',
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

const ButtonInput = forwardRef<React.ComponentRef<typeof TouchableOpacity>, Props>(
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
			buttonClassName = '',
			labelClassName = '',
			errorClassName = '',
			helpTextClassName = '',
			fullWidth = false,
			disabled = false,
			borderless = false,
			important = false,
			srOnlyLabel = false,
			placeholder,
			value,
			...props
		},
		ref
	) => {
		const currentState: ButtonInputState = useMemo(() => {
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

		const buttonClasses = useMemo(() => {
			return `
                flex-1 justify-start
                ${sizeClasses[size].button}
                ${buttonClassName}`;
		}, [size, buttonClassName]);

		const displayText = value || placeholder;
		const textColor = value ? 'text-black' : 'text-gray-500';

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

					<TouchableOpacity ref={ref} className={buttonClasses} disabled={disabled} activeOpacity={0.7} {...props}>
						{displayText && (
							<Text
								className={`${sizeClasses[size].button.split(' ').find((c) => c.startsWith('text-')) || 'text-base'} ${textColor}`}
							>
								{displayText}
							</Text>
						)}
					</TouchableOpacity>

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

ButtonInput.displayName = 'ButtonInput';

export default ButtonInput;
