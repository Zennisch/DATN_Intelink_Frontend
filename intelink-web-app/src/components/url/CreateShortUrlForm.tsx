import { useState } from "react";
import { Input, Checkbox } from "../primary";

interface FormData {
	originalUrl: string;
	customCode: string;
	password: string;
	availableDays: string;
	maxUsage: string;
}

interface CreateShortUrlFormProps {
	formData: FormData;
	onInputChange: (field: keyof FormData) => (value: string) => void;
}

export const CreateShortUrlForm = ({
	formData,
	onInputChange,
}: CreateShortUrlFormProps) => {
	const [hasPassword, setHasPassword] = useState(false);
	const [hasMaxUsage, setHasMaxUsage] = useState(false);

	return (
		<div className="flex-1 space-y-4">
			<div className="pb-3 border-b border-gray-200">
				<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
					Basic Information
				</h3>
			</div>

			{/* Original URL */}
			<Input
				label="Original URL"
				placeholder="https://example.com/your-very-long-url..."
				value={formData.originalUrl}
				onChange={(e) => onInputChange("originalUrl")(e.target.value)}
				fullWidth
				helpText="Enter the full URL you want to shorten"
			/>

			{/* Custom Code */}
			<Input
				label="Custom Short Code"
				placeholder="my-custom-link"
				value={formData.customCode}
				onChange={(e) => onInputChange("customCode")(e.target.value)}
				fullWidth
				helpText="Leave empty for auto-generated code"
			/>

			{/* Available Days */}
			<Input
				label="Available Days"
				type="number"
				placeholder="30"
				value={formData.availableDays}
				onChange={(e) => onInputChange("availableDays")(e.target.value)}
				fullWidth
				helpText="How many days this link will be active"
			/>

			{/* Password Protection */}
			<div className="space-y-3">
				<Checkbox
					checked={hasPassword}
					onChange={setHasPassword}
					label="Protect with Password"
				/>

				{hasPassword && (
					<div className="pl-7 animate-fadeIn">
						<Input
							label="Password"
							type="password"
							placeholder="Enter protection password"
							value={formData.password}
							onChange={(e) => onInputChange("password")(e.target.value)}
							fullWidth
						/>
					</div>
				)}
			</div>

			{/* Max Usage */}
			<div className="space-y-3">
				<Checkbox
					checked={hasMaxUsage}
					onChange={setHasMaxUsage}
					label="Limit Maximum Usage"
				/>

				{hasMaxUsage && (
					<div className="pl-7 animate-fadeIn">
						<Input
							label="Maximum Usage Count"
							type="number"
							placeholder="100"
							value={formData.maxUsage}
							onChange={(e) => onInputChange("maxUsage")(e.target.value)}
							fullWidth
							helpText="Number of times this link can be used"
						/>
					</div>
				)}
			</div>
		</div>
	);
};
