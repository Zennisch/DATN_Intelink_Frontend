import {type ChangeEvent, forwardRef, type InputHTMLAttributes, type ReactNode, useId} from 'react';
import {cn} from './utils.ts';

type LabelPosition = 'right' | 'left';
type Exclude = 'checked' | 'onChange' | 'type';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, Exclude> {
	checked?: boolean;
	defaultChecked?: boolean;
	wrapperClassName?: string;
	inputClassName?: string;
	label?: ReactNode;
	labelPosition?: LabelPosition;
	onChange?: (checked: boolean, e?: ChangeEvent<HTMLInputElement>) => void;
}

export const Radio = forwardRef<HTMLInputElement, Props>(function Radio(
	{
		checked,
		defaultChecked,
		wrapperClassName,
		inputClassName,
		label,
		labelPosition = 'right',
		disabled,
		name,
		value,
		className,
		onChange,
		...props
	},
	ref
) {
	const autoId = useId();
	const id = props.id ?? `radio-${autoId}`;

	const wrapperClasses = cn('inline-flex items-center', wrapperClassName);
	const inputClasses = cn(
		'h-4 w-4 text-gray-600 focus:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-500 border-gray-300',
		inputClassName,
		className
	);

	return (
		<div className={wrapperClasses}>
			{label && labelPosition === 'left' && (
				<label htmlFor={id} className="mr-2 text-sm text-gray-700 cursor-pointer">
					{label}
				</label>
			)}

			<input
				id={id}
				ref={ref}
				type="radio"
				name={name}
				value={value}
				className={inputClasses}
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
