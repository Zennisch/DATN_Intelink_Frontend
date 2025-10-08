import {type ChangeEvent, forwardRef, type InputHTMLAttributes, type ReactNode, type RefObject, useEffect, useId} from 'react';
import {cn} from './utils.ts';

type LabelPosition = 'right' | 'left';
type Exclude = 'checked' | 'onChange';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
	id?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	wrapperClassName?: string;
	inputClassName?: string;
	indeterminate?: boolean;
	label?: ReactNode;
	labelPosition?: LabelPosition;
	onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
	{
		id,
		checked,
		defaultChecked,
		wrapperClassName,
		inputClassName,
		indeterminate = false,
		label,
		labelPosition = 'right',
		disabled,
		name,
		value,
		type = 'checkbox',
		onChange,
		...props
	},
	ref
) {
	const autoId = useId();
	const finalId = id ?? `checkbox-${autoId}`;

	useEffect(() => {
		const input = (ref as RefObject<HTMLInputElement>).current;
		if (input) {
			input.indeterminate = Boolean(indeterminate);
		} else {
			const el = document.getElementById(finalId) as HTMLInputElement | null;
			if (el) el.indeterminate = Boolean(indeterminate);
		}
	}, [indeterminate, ref, finalId]);

	const classes = cn('h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded', inputClassName);

	return (
		<div className={cn('flex items-center', wrapperClassName)}>
			{label && labelPosition === 'left' && (
				<label htmlFor={finalId} className="mr-2 text-sm text-gray-700 cursor-pointer">
					{label}
				</label>
			)}

			<input
				id={finalId}
				ref={ref}
				type={type}
				name={name}
				value={value}
				className={classes}
				checked={checked}
				defaultChecked={defaultChecked}
				disabled={disabled}
				onChange={(e) => {
					onChange?.(e.target.checked, e);
				}}
				{...props}
			/>

			{label && labelPosition === 'right' && (
				<label htmlFor={finalId} className="ml-2 text-sm text-gray-700 cursor-pointer">
					{label}
				</label>
			)}
		</div>
	);
});
