import { forwardRef, memo } from 'react';
import { Text as TextBase, TextProps, TouchableOpacity } from 'react-native';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

type TextWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

type TextColor = 'black' | 'white' | 'red' | 'green' | 'blue' | 'yellow' | 'gray';

const sizeClasses: Record<TextSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl',
	'6xl': 'text-6xl',
};

const weightClasses: Record<TextWeight, string> = {
	thin: 'font-thin',
	extralight: 'font-extralight',
	light: 'font-light',
	normal: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
	extrabold: 'font-extrabold',
	black: 'font-black',
};

const alignClasses: Record<TextAlign, string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
	justify: 'text-justify',
};

const colorClasses: Record<TextColor, string> = {
	black: 'text-black',
	white: 'text-white',
	red: 'text-red-500',
	green: 'text-green-500',
	blue: 'text-blue-500',
	yellow: 'text-yellow-500',
	gray: 'text-gray-500',
};

interface Props extends TextProps {
	size?: TextSize;
	weight?: TextWeight;
	align?: TextAlign;
	color?: TextColor;
	className?: string;
	onPress?: () => void;
}
const Text = forwardRef<React.ComponentRef<typeof TextBase>, Props>(
	({size = 'md', weight = 'normal', align = 'left', color = 'black', className = '', onPress, ...props}, ref) => {
		if (onPress) {
			return (
				<TouchableOpacity onPress={onPress}>
					<TextBase
						ref={ref}
						className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${colorClasses[color]} ${className}`}
						{...props}
					/>
				</TouchableOpacity>
			);
		}
		return (
			<TextBase
				ref={ref}
				className={`${sizeClasses[size]} ${weightClasses[weight]} ${alignClasses[align]} ${colorClasses[color]} ${className}`}
				{...props}
			/>
		);
	}
);

Text.displayName = 'Text';

export default memo(Text);
