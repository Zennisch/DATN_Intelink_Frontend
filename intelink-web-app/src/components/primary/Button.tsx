import {type ButtonHTMLAttributes, forwardRef, type ReactNode} from 'react';
import {cn} from './utils.ts';

type Variant = 'primary' | 'secondary' | 'outline' | 'social';
type Size = 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'right';

const variantClasses: Record<Variant, string> = {
	primary: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-500',
	secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
	outline: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 border border-gray-300',
	social: 'bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 border border-gray-300',
};

const sizeClasses: Record<Size, string> = {
	sm: 'px-3 py-2 text-sm',
	md: 'px-4 py-3 text-base',
	lg: 'px-6 py-4 text-lg',
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
	children: ReactNode;
	variant?: Variant;
	size?: Size;
	icon?: ReactNode;
	iconPosition?: IconPosition;
	loading?: boolean;
	loadingIcon?: ReactNode;
	fullWidth?: boolean;
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
	const baseClasses = `flex items-center justify-center 
		font-medium rounded-lg transition-all duration-200 
		focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
		disabled:opacity-50 disabled:cursor-not-allowed`;

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
