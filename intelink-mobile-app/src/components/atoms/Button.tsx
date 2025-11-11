import { forwardRef, memo, ReactNode, useMemo } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variantClasses: Record<ButtonVariant, string> = {
	primary: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500',
	secondary: 'bg-gray-100 text-black hover:bg-gray-200 focus-visible:ring-gray-500',
	outline: 'bg-white text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 border border-gray-700',
	ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
};

const variantTextClasses: Record<ButtonVariant, string> = {
	primary: 'text-white',
	secondary: 'text-black',
	outline: 'text-gray-700',
	ghost: 'text-gray-700',
};

const sizeClasses: Record<ButtonSize, string> = {
	xs: 'px-2 py-2 text-xs',
	sm: 'px-3 py-2 text-sm',
	md: 'px-4 py-2 text-base',
	lg: 'px-5 py-2 text-lg',
	xl: 'px-6 py-2 text-xl',
};

const sizeTextClasses: Record<ButtonSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
};

interface ButtonProps extends TouchableOpacityProps {
	children: ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
	loading?: boolean;
	loadingIcon?: ReactNode;
	icon?: ReactNode;
	iconPosition?: 'left' | 'right';
	textClassName?: string;
	className?: string;
}

const Button = forwardRef<React.ComponentRef<typeof TouchableOpacity>, ButtonProps>(
	(
		{
			children,
			variant = 'primary',
			size = 'md',
			fullWidth = false,
			loading = false,
			loadingIcon,
			icon,
			iconPosition = 'left',
			disabled,
			textClassName = '',
			className = '',
			...props
		},
		ref
	) => {
		const buttonClassName = useMemo(() => {
			return `
				flex flex-row justify-center items-center 
				rounded-md transition-all duration-200 
				disabled:opacity-50 disabled:cursor-not-allowed 
				${variantClasses[variant]} 
				${sizeClasses[size]} 
				${fullWidth ? 'w-full' : ''} 
				${className}`;
		}, [variant, size, fullWidth, className]);

		const getDefaultLoadingIcon = (variant: ButtonVariant, size: ButtonSize) => {
			const sizeMap = {xs: 'w-1 h-1', sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4', xl: 'w-5 h-5'};
			const colorMap = {primary: 'border-white', secondary: 'border-black', outline: 'border-gray-700', ghost: 'border-gray-700'};

			return (
				<View
					className={`${sizeMap[size]} border-2 ${colorMap[variant]} border-t-transparent rounded-full animate-spin`}
				/>
			);
		};

		if (loading && !loadingIcon) {
			loadingIcon = getDefaultLoadingIcon(variant, size);
		}

		return (
			<TouchableOpacity ref={ref} disabled={disabled || loading} className={buttonClassName} {...props}>
				{loading && loadingIcon && iconPosition === 'left' && <View className="mr-2">{loadingIcon}</View>}

				{!loading && icon && iconPosition === 'left' && <View className="mr-2">{icon}</View>}

				{typeof children === 'string' ? (
					<Text className={`${variantTextClasses[variant]} ${sizeTextClasses[size]} ${textClassName}`}>{children}</Text>
				) : (
					children
				)}

				{!loading && icon && iconPosition === 'right' && <View className="ml-2">{icon}</View>}

				{loading && loadingIcon && iconPosition === 'right' && <View className="ml-2">{loadingIcon}</View>}
			</TouchableOpacity>
		);
	}
);

Button.displayName = 'Button';

export default memo(Button);
