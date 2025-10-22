import {type ChangeEvent, forwardRef, type InputHTMLAttributes, type ReactNode, useEffect, useId, useState} from 'react';
import {cn, FOCUS_STYLES, SPACING, COLORS, SIZES} from './utils.ts';

type Exclude = 'onChange' | 'type' | 'value';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
	// Core behavior props
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	defaultValue?: number;
	
	// Styling props
	showValue?: boolean;
	valueFormatter?: (v: number) => ReactNode;
	
	// Layout props
	fullWidth?: boolean;
	
	// State props
	helpText?: ReactNode;
	error?: ReactNode;
	
	// Callback props
	onChange?: (value: number, e?: ChangeEvent<HTMLInputElement>) => void;
	
	// Styling override props
	wrapperClassName?: string;
	inputClassName?: string;
	trackClassName?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
	{
		min = 0,
		max = 100,
		step = 1,
		value,
		defaultValue,
		showValue = false,
		fullWidth = false,
		helpText,
		error,
		wrapperClassName,
		inputClassName,
		trackClassName,
		className,
		disabled,
		valueFormatter,
		onChange,
		...props
	},
	ref
) {
	const autoId = useId();
	const id = props.id ?? autoId;

	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<number>(isControlled ? (value as number) : defaultValue ?? min);

	useEffect(() => {
		if (isControlled) {
			setInternalValue(value as number);
		}
	}, [value, isControlled]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const next = Number(e.target.value);
		if (!isControlled) setInternalValue(next);
		onChange?.(next, e);
	};

	const displayedValue = isControlled ? (value as number) : internalValue;
	const describedByIds: string[] = [];
	if (helpText) describedByIds.push(`${id}-help`);
	if (error) describedByIds.push(`${id}-error`);

	const wrapperClasses = cn(fullWidth ? 'w-full' : '', wrapperClassName);
	const trackClasses = cn('flex items-center space-x-4', trackClassName);
	const classes = cn(
		'h-2 appearance-none rounded-lg w-full',
		COLORS.background.gray,
		FOCUS_STYLES,
		error ? COLORS.border.errorFocus : '',
		inputClassName,
		className
	);

	return (
		<div className={wrapperClasses}>
			<div className={trackClasses}>
				<input
					id={id}
					ref={ref}
					type="range"
					min={min}
					max={max}
					step={step}
					value={displayedValue}
					defaultValue={defaultValue}
					onChange={handleChange}
					aria-valuemin={min}
					aria-valuemax={max}
					aria-valuenow={displayedValue}
					aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
					disabled={disabled}
					className={classes}
					{...props}
				/>

				{showValue && (
					<div className={cn('w-3 text-center tabular-nums', SIZES.text.sm, COLORS.text.secondary)}>
						{valueFormatter ? valueFormatter(displayedValue) : displayedValue}
					</div>
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
