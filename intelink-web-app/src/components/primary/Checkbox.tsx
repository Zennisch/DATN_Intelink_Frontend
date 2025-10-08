import {type ChangeEvent, forwardRef, type InputHTMLAttributes, type ReactNode, type RefObject, useEffect, useId} from 'react';
import {cn} from './utils.ts';

type LabelPosition = 'right' | 'left';
type Exclude = 'checked' | 'onChange';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
	checked?: boolean;
	defaultChecked?: boolean;
	indeterminate?: boolean;
	label?: ReactNode;
	labelPosition?: LabelPosition;
	wrapperClassName?: string;
	inputClassName?: string;
	onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void;
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

	const classes = cn('h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded', inputClassName);

	return (
		<div className={cn('flex items-center', wrapperClassName)}>
			{label && labelPosition === 'left' && (
				<label htmlFor={id} className="mr-2 text-sm text-gray-700 cursor-pointer">
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
				onChange={(e) => {
					onChange?.(e.target.checked, e);
				}}
				{...props}
			/>

			{label && labelPosition === 'right' && (
				<label htmlFor={id} className="ml-2 text-sm text-gray-700 cursor-pointer">
					{label}
				</label>
			)}
		</div>
	);
});
