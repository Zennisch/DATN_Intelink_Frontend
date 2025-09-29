import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, fullWidth = false, className = "", ...props }, ref) => {
		const baseClasses =
			"block px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200";
		const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
		const widthClasses = fullWidth ? "w-full" : "";

		const inputClasses = `${baseClasses} ${errorClasses} ${widthClasses} ${className}`;

		return (
			<div className={fullWidth ? "w-full" : ""}>
				{label && (
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{label}
					</label>
				)}
				<input ref={ref} className={inputClasses} {...props} />
				{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
