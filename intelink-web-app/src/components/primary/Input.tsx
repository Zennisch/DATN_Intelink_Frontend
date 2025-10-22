import {forwardRef, type InputHTMLAttributes, type ReactNode, useId} from 'react';
import {cn, FOCUS_STYLES, TRANSITION, SPACING, COLORS, SIZES, DISPLAY_MODES} from './utils.ts';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	// Content props
	label?: ReactNode;
	
	// Layout props
	fullWidth?: boolean;
	labelSrOnly?: boolean;
	
	// State props
	error?: ReactNode;
	helpText?: ReactNode;
	
	// Styling override props
	wrapperClassName?: string;
	inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
	{
		label,
		error,
		helpText,
		fullWidth = false,
		labelSrOnly = false,
		wrapperClassName = '',
		inputClassName = '',
		className,
		...props
	},
	ref
) {
		const autoId = useId();
		const id = props.id ?? autoId;

		const describedByIds: string[] = [];
		if (error) describedByIds.push(`${id}-error`);
		if (helpText) describedByIds.push(`${id}-help`);

		const baseClasses = cn(
			DISPLAY_MODES.formControl,
			SIZES.padding.input,
			'border',
			SIZES.borderRadius,
			COLORS.text.primary,
			'placeholder-gray-500',
			TRANSITION,
			FOCUS_STYLES,
			'focus:border-transparent'
		);
		const errorClasses = error ? `${COLORS.border.error} ${COLORS.border.errorFocus}` : COLORS.border.default;
		const widthClass = fullWidth ? 'w-full' : '';

		const classes = cn(baseClasses, errorClasses, widthClass, inputClassName, className);

		return (
			<div className={cn(fullWidth ? 'w-full' : '', wrapperClassName)}>
				{label && (
					<label htmlFor={id} className={labelSrOnly ? 'sr-only' : `block ${SIZES.text.sm} font-medium ${COLORS.text.secondary} mb-2`}>
						{label}
					</label>
				)}

				<input
					id={id}
					ref={ref}
					className={classes}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
					{...props}
				/>

				{helpText && (
					<p id={`${id}-help`} className={`${SPACING.helpText} ${SIZES.text.sm} ${COLORS.text.muted}`} aria-hidden={error ? 'true' : undefined}>
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
