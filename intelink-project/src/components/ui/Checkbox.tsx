import type { ReactNode } from "react";

interface CheckboxProps {
	id: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: ReactNode;
	className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
	id,
	checked,
	onChange,
	label,
	className = "",
}) => {
	return (
		<div className={`flex items-center ${className}`}>
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
			/>
			{label && (
				<label
					htmlFor={id}
					className="ml-2 block text-sm text-gray-700 cursor-pointer"
				>
					{label}
				</label>
			)}
		</div>
	);
};
