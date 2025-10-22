import {type ChangeEvent, forwardRef, type InputHTMLAttributes, type ReactNode, type RefObject, useEffect, useId} from 'react';
import {cn, FOCUS_STYLES, SPACING, COLORS, SIZES, DISPLAY_MODES} from './utils.ts';

type LabelPosition = 'right' | 'left';
type Exclude = 'checked' | 'onChange';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
	// Core behavior props
	checked?: boolean;
	defaultChecked?: boolean;
	indeterminate?: boolean;
	
	// Content props
	label?: ReactNode;
	
	// Styling props
	labelPosition?: LabelPosition;
	
	// State props
	error?: ReactNode;
	helpText?: ReactNode;
	
	// Callback props
	onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void;
	
	// Styling override props
	wrapperClassName?: string;
	inputClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
	{
		checked,
		defaultChecked,
		indeterminate = false,
		label,
		labelPosition = 'right',
		wrapperClassName,
		inputClassName,
		disabled,
		name,
		value,
		type = 'checkbox',
		error,
		helpText,
		onChange,
		...props
	},
	ref
) {
	const autoId = useId();
	const id = props.id ?? autoId;

	useEffect(() => {
		const input = (ref as RefObject<HTMLInputElement>).current;
		if (input) {
			input.indeterminate = Boolean(indeterminate);
		} else {
			const el = document.getElementById(id) as HTMLInputElement | null;
			if (el) el.indeterminate = Boolean(indeterminate);
		}
	}, [indeterminate, ref, id]);

	const describedByIds: string[] = [];
	if (error) describedByIds.push(`${id}-error`);
	if (helpText) describedByIds.push(`${id}-help`);

	const classes = cn(
		'h-4 w-4',
		COLORS.text.secondary,
		FOCUS_STYLES,
		'rounded',
		error ? `${COLORS.border.error} ${COLORS.border.errorFocus}` : COLORS.border.default,
		inputClassName
	);

	return (
		<div className={cn('flex flex-col', wrapperClassName)}>
			<div className={DISPLAY_MODES.interactive}>
				{label && labelPosition === 'left' && (
					<label htmlFor={id} className={cn(COLORS.text.secondary, SIZES.text.sm, 'cursor-pointer', SPACING.labelLeft)}>
						{label}
					</label>
				)}

				<input
					id={id}
					ref={ref}
					type={type}
					name={name}
					value={value}
					className={classes}
					checked={checked}
					defaultChecked={defaultChecked}
					disabled={disabled}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
					onChange={(e) => {
						onChange?.(e.target.checked, e);
					}}
					{...props}
				/>

				{label && labelPosition === 'right' && (
					<label htmlFor={id} className={cn(COLORS.text.secondary, SIZES.text.sm, 'cursor-pointer', SPACING.labelRight)}>
						{label}
					</label>
				)}
			</div>

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
