import {type ChangeEvent, forwardRef, type ReactNode, type SelectHTMLAttributes, useId} from 'react';
import {cn, FOCUS_STYLES, TRANSITION, SPACING, COLORS, SIZES, DISPLAY_MODES} from './utils.ts';

type OptionItem = {
	value: string | number;
	label: ReactNode;
	disabled?: boolean;
};
type Exclude = 'onChange' | 'children';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, Exclude> {
	// Content props
	options?: OptionItem[];
	children?: ReactNode;
	placeholder?: string;
	
	// Layout props
	fullWidth?: boolean;
	
	// State props
	error?: ReactNode;
	helpText?: ReactNode;
	
	// Callback props
	onChange?: (value: string, e?: ChangeEvent<HTMLSelectElement>) => void;
	
	// Styling override props
	wrapperClassName?: string;
	selectClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{
		options = [],
		children,
		placeholder,
		error,
		helpText,
		fullWidth = false,
		className,
		wrapperClassName = '',
		selectClassName = '',
		value,
		defaultValue,
		disabled,
		onChange,
		...props
	},
	ref
) {
	const autoId = useId();
	const id = props.id ?? autoId;

	const describedByIds: string[] = [];
	if (helpText) describedByIds.push(`${id}-help`);
	if (error) describedByIds.push(`${id}-error`);

	const classes = cn(
		DISPLAY_MODES.formControl,
		'w-full',
		SIZES.padding.input,
		'border',
		SIZES.borderRadius,
		COLORS.text.primary,
		COLORS.background.white,
		FOCUS_STYLES,
		TRANSITION,
		error ? `${COLORS.border.error} ${COLORS.border.errorFocus}` : COLORS.border.default,
		selectClassName,
		className
	);

	return (
		<div className={cn(fullWidth ? 'w-full' : '', wrapperClassName)}>
			<select
				id={id}
				ref={ref}
				className={classes}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
				value={value}
				defaultValue={defaultValue}
				disabled={disabled}
				onChange={(e) => {
					onChange?.(e.target.value, e);
				}}
				{...props}
			>
				{placeholder && !props.multiple && (
					<option value="" disabled hidden>
						{placeholder}
					</option>
				)}

				{options.length
					? options.map((opt) => (
							<option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
								{opt.label}
							</option>
					  ))
					: children}
			</select>

			{helpText && (
				<p id={`${id}-help`} className={`${SPACING.helpText} ${SIZES.text.sm} ${COLORS.text.muted}`}>
					{helpText}
				</p>
			)}

			{error && (
				<p id={`${id}-error`} className={`${SPACING.helpText} ${SIZES.text.sm} ${COLORS.text.error}`} role="alert" aria-live="polite">
					{error}
				</p>
			)}
		</div>
	);
});
