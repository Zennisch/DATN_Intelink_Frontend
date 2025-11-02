import { useState } from "react";
import { Input, Button } from "../primary";
import {
	getIPValidationError,
	formatCIDRSize,
	isValidCIDR,
} from "../../utils/ipValidation";

interface IPRangeInputProps {
	ipRanges: string[];
	onChange: (ranges: string[]) => void;
	disabled?: boolean;
}

export const IPRangeInput = ({
	ipRanges,
	onChange,
	disabled = false,
}: IPRangeInputProps) => {
	const [currentInput, setCurrentInput] = useState("");
	const [error, setError] = useState<string | undefined>();

	const handleAdd = () => {
		const trimmed = currentInput.trim();
		if (!trimmed) return;

		const validationError = getIPValidationError(trimmed);
		if (validationError) {
			setError(validationError);
			return;
		}

		// Check for duplicates
		if (ipRanges.includes(trimmed)) {
			setError("This IP/CIDR is already added");
			return;
		}

		onChange([...ipRanges, trimmed]);
		setCurrentInput("");
		setError(undefined);
	};

	const handleRemove = (index: number) => {
		onChange(ipRanges.filter((_, i) => i !== index));
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<div className="space-y-3">
			<label className="block text-sm font-medium text-gray-700">
				IP Addresses / CIDR Ranges
			</label>

			{/* Input Section */}
			<div className="flex gap-3">
				<div className="flex-1">
					<Input
						placeholder="192.168.1.0/24 or 10.0.0.1"
						value={currentInput}
						onChange={(e) => {
							setCurrentInput(e.target.value);
							setError(undefined);
						}}
						onKeyPress={handleKeyPress}
						disabled={disabled}
						error={error}
						fullWidth
					/>
				</div>
				<Button
					type="button"
					onClick={handleAdd}
					disabled={!currentInput.trim() || disabled}
					variant="secondary"
					className="shrink-0"
				>
					<i className="fas fa-plus mr-2"></i>
					Add
				</Button>
			</div>

			{/* Help Text */}
			<p className="text-xs text-gray-500">
				Enter single IP (e.g., 192.168.1.1) or CIDR notation (e.g.,
				192.168.1.0/24)
			</p>

			{/* List of added ranges */}
			{ipRanges.length > 0 && (
				<div className="space-y-2 mt-4">
					<p className="text-xs font-medium text-gray-700">
						Added IP Ranges ({ipRanges.length}):
					</p>
					<div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
						{ipRanges.map((range, index) => (
							<div
								key={index}
								className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md group hover:bg-gray-100 transition-colors"
							>
								<div className="flex items-center gap-2 flex-1 min-w-0">
									<i className="fas fa-network-wired text-gray-400 text-sm shrink-0"></i>
									<code className="text-sm font-mono text-gray-700 truncate">
										{range}
									</code>
									{isValidCIDR(range) && (
										<span className="text-xs text-gray-500 shrink-0">
											({formatCIDRSize(range)})
										</span>
									)}
								</div>
								<button
									type="button"
									onClick={() => handleRemove(index)}
									disabled={disabled}
									className="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
									aria-label="Remove IP range"
								>
									<i className="fas fa-times"></i>
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
