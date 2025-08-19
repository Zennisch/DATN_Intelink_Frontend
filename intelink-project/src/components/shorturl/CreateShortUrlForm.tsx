import React from "react";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import type { CreateShortUrlRequest } from "../../dto/request/ShortUrlRequest";

interface CreateShortUrlFormProps {
	onSubmit: (data: CreateShortUrlRequest) => Promise<void>;
	loading?: boolean;
	error?: string | null;
	onClose?: () => void;
}

interface FormData {
	originalUrl: string;
	description: string;
	password: string;
	maxUsage: string;
	availableDays: string;
}

const initialData: FormData = {
	originalUrl: "",
	description: "",
	password: "",
	maxUsage: "",
	availableDays: "30",
};

export const CreateShortUrlForm: React.FC<CreateShortUrlFormProps> = ({
	onSubmit,
	loading = false,
	error,
	onClose,
}) => {
	const [hasPassword, setHasPassword] = React.useState(false);
	const [hasMaxUsage, setHasMaxUsage] = React.useState(false);

	const { formData, errors, handleInputChange, handleSubmit } =
		useForm<FormData>(
			initialData,
			(data) => {
				const errors: Partial<Record<keyof FormData, string>> = {};

				// Required field validation
				if (!data.originalUrl.trim()) {
					errors.originalUrl = "Original URL is required";
				} else if (!isValidUrl(data.originalUrl)) {
					errors.originalUrl = "Invalid URL";
				}

				// Conditional validations
				if (hasPassword && !data.password.trim()) {
					errors.password = "Password is required when protection is enabled";
				}

				if (
					hasMaxUsage &&
					(!data.maxUsage.trim() || parseInt(data.maxUsage) <= 0)
				) {
					errors.maxUsage = "Maximum usage must be greater than 0";
				}

				if (!data.availableDays.trim() || parseInt(data.availableDays) <= 0) {
					errors.availableDays = "Available days must be greater than 0";
				}

				return errors;
			},
			async (data) => {
				const request: CreateShortUrlRequest = {
					originalUrl: data.originalUrl.trim(),
					description: data.description.trim() || undefined,
					password: hasPassword ? data.password.trim() : undefined,
					maxUsage: hasMaxUsage ? parseInt(data.maxUsage) : undefined,
					availableDays: parseInt(data.availableDays),
				};

				await onSubmit(request);
			},
		);

	// URL validation helper
	const isValidUrl = (url: string): boolean => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Original URL */}
				<div>
					<Input
						label="Original URL *"
						type="url"
						value={formData.originalUrl}
						onChange={handleInputChange("originalUrl")}
						error={errors.originalUrl}
						placeholder="https://example.com"
						required
					/>
				</div>

				{/* Description */}
				<div>
					<Input
						label="Description"
						value={formData.description}
						onChange={handleInputChange("description")}
						error={errors.description}
						placeholder="Brief description of this URL..."
					/>
				</div>

				{/* Available Days */}
				<div>
					<Input
						label="Available Days *"
						type="number"
						min="1"
						value={formData.availableDays}
						onChange={handleInputChange("availableDays")}
						error={errors.availableDays}
						placeholder="30"
						required
					/>
				</div>

				{/* Advanced Options */}
				<div className="space-y-4 border-t pt-4">
					<h3 className="text-sm font-medium text-gray-900">Advanced Options</h3>
					
					{/* Password Protection */}
					<div className="space-y-3">
						<Checkbox
							id="hasPassword"
							label="Password Protection"
							checked={hasPassword}
							onChange={setHasPassword}
						/>
						{hasPassword && (
							<div className="ml-6">
								<Input
									label="Password"
									type="password"
									value={formData.password}
									onChange={handleInputChange("password")}
									error={errors.password}
									placeholder="Enter protection password"
								/>
							</div>
						)}
					</div>

					{/* Max Usage */}
					<div className="space-y-3">
						<Checkbox
							id="hasMaxUsage"
							label="Limit Usage Count"
							checked={hasMaxUsage}
							onChange={setHasMaxUsage}
						/>
						{hasMaxUsage && (
							<div className="ml-6">
								<Input
									label="Maximum Usage Count"
									type="number"
									min="1"
									value={formData.maxUsage}
									onChange={handleInputChange("maxUsage")}
									error={errors.maxUsage}
									placeholder="100"
								/>
							</div>
						)}
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-md p-3">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						</div>
					</div>
				)}

				{/* Form Actions */}
				<div className="flex gap-3 pt-4 border-t">
					{onClose && (
						<Button
							type="button"
							variant="secondary"
							onClick={onClose}
							disabled={loading}
							className="flex-1"
						>
							Cancel
						</Button>
					)}
					<Button
						type="submit"
						loading={loading}
						disabled={loading}
						className="flex-1 bg-blue-600 hover:bg-blue-700"
					>
						Create Short URL
					</Button>
				</div>
			</form>
		</div>
	);
};
