import {type ButtonHTMLAttributes, forwardRef, type ReactNode} from 'react';
import {cn, FOCUS_STYLES, TRANSITION, SIZES, DISPLAY_MODES} from './utils.ts';

type Variant = 'primary' | 'secondary' | 'outline' | 'social' | 'ghost';
type Size = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

const variantClasses: Record<Variant, string> = {
	primary: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500',
	secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
	outline: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 border border-gray-300',
	social: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 border border-gray-300',
	ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
};

const sizeClasses: Record<Size, string> = {
	sm: `${SIZES.padding.button.sm} ${SIZES.text.sm}`,
	md: `${SIZES.padding.button.md} ${SIZES.text.base}`,
	lg: `${SIZES.padding.button.lg} ${SIZES.text.lg}`,
};

const DefaultSpinner = (
	<svg
		className="animate-spin h-4 w-4"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		role="img"
		aria-hidden="true"
	>
		<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
		<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
	</svg>
);

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	// Content props
	children: ReactNode;
	icon?: ReactNode;
	loadingIcon?: ReactNode;
	
	// Styling props
	variant?: Variant;
	size?: Size;
	iconPosition?: IconPosition;
	
	// Layout props
	fullWidth?: boolean;
	
	// State props
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
	{
		children,
		variant = 'secondary',
		size = 'md',
		icon,
		iconPosition = 'left',
		loading = false,
		loadingIcon,
		className,
		disabled,
		fullWidth = false,
		type = 'button',
		...props
	},
	ref
) {
	const baseClasses = cn(
		DISPLAY_MODES.button,
		'font-medium',
		SIZES.borderRadius,
		TRANSITION,
		FOCUS_STYLES,
		'disabled:opacity-50 disabled:cursor-not-allowed'
	);

	const widthClass = fullWidth ? 'w-full' : '';

	const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], widthClass, className);

	const isLoadingVisual = loading;

	return (
		<button
			ref={ref}
			type={type}
			className={classes}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			aria-disabled={disabled || loading || undefined}
			{...props}
		>
			{isLoadingVisual && iconPosition === 'left' && (
				<span className="mr-2 inline-flex" role="status" aria-hidden={loadingIcon ? 'false' : 'true'}>
					{loadingIcon ?? DefaultSpinner}
				</span>
			)}

			{!loading && icon && iconPosition === 'left' && <span className="mr-2 inline-flex">{icon}</span>}

			{children}

			{!loading && icon && iconPosition === 'right' && <span className="ml-2 inline-flex">{icon}</span>}

			{isLoadingVisual && iconPosition === 'right' && (
				<span className="ml-2 inline-flex" role="status" aria-hidden={loadingIcon ? 'false' : 'true'}>
					{loadingIcon ?? DefaultSpinner}
				</span>
			)}
		</button>
	);
});
