import {forwardRef, type InputHTMLAttributes, type ReactNode, useId} from 'react';
import {cn} from './utils.ts';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label?: ReactNode;
	error?: ReactNode;
	helpText?: ReactNode;
	fullWidth?: boolean;
	labelSrOnly?: boolean;
	wrapperClassName?: string;
	inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
	(
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
	) => {
		const autoId = useId();
		const id = props.id ?? autoId;

		const describedByIds: string[] = [];
		if (error) describedByIds.push(`${id}-error`);
		if (helpText) describedByIds.push(`${id}-help`);

		const baseClasses = `block px-3 py-3 
      border rounded-lg 
      text-gray-900 placeholder-gray-500  
      transition-all duration-200 
      focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus:border-transparent`;
		const errorClasses = error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300';
		const widthClass = fullWidth ? 'w-full' : '';

		const inputClasses = cn(baseClasses, errorClasses, widthClass, inputClassName, className);

		return (
			<div className={cn(fullWidth ? 'w-full' : '', wrapperClassName)}>
				{label && (
					<label htmlFor={id} className={labelSrOnly ? 'sr-only' : 'block text-sm font-medium text-gray-700 mb-2'}>
						{label}
					</label>
				)}

				<input
					id={id}
					ref={ref}
					className={inputClasses}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={describedByIds.length ? describedByIds.join(' ') : undefined}
					{...props}
				/>

				{helpText && (
					<p id={`${id}-help`} className="mt-1 text-sm text-gray-500" aria-hidden={error ? 'true' : undefined}>
						{helpText}
					</p>
				)}

				{error && (
					<p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
						{error}
					</p>
				)}
			</div>
		);
	}
);
