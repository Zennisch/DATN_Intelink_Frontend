import { useState } from "react";
import { Button, Checkbox, Input, Modal } from "../primary";
import {
	AccessControlSection,
	type AccessControlData,
} from "./AccessControlSection";
import { useShortUrl } from "../../hooks/useShortUrl";
import type { CreateShortUrlRequest } from "../../dto/ShortUrlDTO";
import type { AccessControlMode } from "../../models/ShortUrl";

interface CreateShortUrlModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export const CreateShortUrlModal = ({
	open,
	onClose,
	onSuccess,
}: CreateShortUrlModalProps) => {
	const { createShortUrl, loading } = useShortUrl();
	
	const [isExtraExpanded, setIsExtraExpanded] = useState(false);
	
	const [hasAvailableDays, setHasAvailableDays] = useState(false);
	const [hasMaxUsage, setHasMaxUsage] = useState(false);
	const [hasPassword, setHasPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		originalUrl: "",
		title: "",
		description: "",
		customCode: "",
		availableDays: "30",
		maxUsage: "100",
		password: "",
	});

	const [accessControl, setAccessControl] = useState<AccessControlData>({
		mode: "allow",
		countries: [],
		ipRanges: [],
	});

	const handleInputChange =
		(field: keyof typeof formData) => (value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
			setError(null);
		};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validate required fields
		if (!formData.originalUrl.trim()) {
			setError("Original URL is required");
			return;
		}

		// Build request matching DTO
		const request: CreateShortUrlRequest = {
			originalUrl: formData.originalUrl.trim(),
		};

		// Optional fields
		if (formData.title.trim()) {
			request.title = formData.title.trim();
		}
		if (formData.description.trim()) {
			request.description = formData.description.trim();
		}
		if (formData.customCode.trim()) {
			request.customCode = formData.customCode.trim();
		}

		// Conditional fields based on checkboxes
		if (hasAvailableDays && formData.availableDays) {
			request.availableDays = parseInt(formData.availableDays, 10);
		}
		if (hasMaxUsage && formData.maxUsage) {
			request.maxUsage = parseInt(formData.maxUsage, 10);
		}
		if (hasPassword && formData.password.trim()) {
			request.password = formData.password.trim();
		}

		// Access control mapping
		if (accessControl.countries.length > 0 || accessControl.ipRanges.length > 0) {
			request.accessControlMode = accessControl.mode.toUpperCase() as AccessControlMode;
			if (accessControl.countries.length > 0) {
				request.accessControlGeographies = accessControl.countries;
			}
			if (accessControl.ipRanges.length > 0) {
				request.accessControlCIDRs = accessControl.ipRanges;
			}
		}

		try {
			await createShortUrl(request);
			handleClose();
			onSuccess?.();
		} catch (err) {
			console.error('Failed to create short URL:', err);
			setError(err instanceof Error ? err.message : 'Failed to create short URL');
		}
	};

	const handleClose = () => {
		setFormData({
			originalUrl: "",
			title: "",
			description: "",
			customCode: "",
			password: "",
			availableDays: "30",
			maxUsage: "100",
		});
		setAccessControl({
			mode: "allow",
			countries: [],
			ipRanges: [],
		});
		setHasAvailableDays(false);
		setHasMaxUsage(false);
		setHasPassword(false);
		setIsExtraExpanded(false);
		setError(null);
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={"Create Short URL"}
			size="6xl"
			className="transition-all duration-200 overflow-y-auto max-w-[90vw] max-h-[90vh]"
		>
			<form onSubmit={handleSubmit}>
				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
						<i className="fas fa-exclamation-circle"></i>
						<span>{error}</span>
					</div>
				)}
				
				<div className="flex flex-1 flex-col gap-6">
					{/* Basic Settings Section */}
					<div className="flex flex-col gap-3">
						<div className="pb-2 border-b border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
								Basic Settings
							</h3>
						</div>
						<div className="flex flex-col gap-4">
							<Input
								label="Original URL *"
								placeholder="https://example.com/your-very-long-url..."
								value={formData.originalUrl}
								onChange={(e) =>
									handleInputChange("originalUrl")(e.target.value)
								}
								fullWidth
								helpText="Enter the full URL you want to shorten"
								required
							/>
							<div className="flex flex-row gap-4">
								<Input
									label="Title"
									placeholder="My awesome link"
									value={formData.title}
									onChange={(e) =>
										handleInputChange("title")(e.target.value)
									}
									wrapperClassName="w-1/2"
									inputClassName="w-full"
									helpText="Optional title for your link"
								/>
								<Input
									label="Custom Short Code"
									placeholder="my-custom-link"
									value={formData.customCode}
									onChange={(e) =>
										handleInputChange("customCode")(e.target.value)
									}
									wrapperClassName="w-1/2"
									inputClassName="w-full"
									helpText="Leave empty for auto-generated code"
								/>
							</div>
							<Input
								label="Description"
								placeholder="Brief description of your link..."
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description")(e.target.value)
								}
								fullWidth
								helpText="Optional description"
							/>
						</div>
					</div>

					{/* Extra Settings Section */}
					<div className="flex flex-col gap-3">
						<div className="pb-2 border-b border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
								Extra Settings
							</h3>
						</div>
						<div className="flex flex-row gap-4">
							<div className="w-1/3 space-y-3">
								<Checkbox
									checked={hasAvailableDays}
									onChange={setHasAvailableDays}
									label="Limit Available Days"
								/>
								<div
									className={`field-container p-1 ${hasAvailableDays ? "expanded" : ""}`}
								>
									<Input
										label="Available Days"
										type="number"
										placeholder="30"
										value={formData.availableDays}
										onChange={(e) =>
											handleInputChange("availableDays")(e.target.value)
										}
										fullWidth
										helpText="How many days this link will be active"
									/>
								</div>
							</div>
							<div className="w-1/3 space-y-3">
								<Checkbox
									checked={hasMaxUsage}
									onChange={setHasMaxUsage}
									label="Limit Maximum Usage"
								/>
								<div
									className={`field-container p-1 ${hasMaxUsage ? "expanded" : ""}`}
								>
									<Input
										label="Maximum Usage"
										type="number"
										placeholder="100"
										value={formData.maxUsage}
										onChange={(e) =>
											handleInputChange("maxUsage")(e.target.value)
										}
										fullWidth
										helpText="Maximum number of times this link can be used"
									/>
								</div>
							</div>
							<div className="w-1/3 space-y-3">
								<Checkbox
									checked={hasPassword}
									onChange={setHasPassword}
									label="Protect with Password"
								/>
								<div
									className={`field-container p-1 ${hasPassword ? "expanded" : ""}`}
								>
									<Input
										label="Password"
										type="password"
										placeholder="Enter protection password"
										value={formData.password}
										onChange={(e) =>
											handleInputChange("password")(e.target.value)
										}
										fullWidth
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Expand/Collapse Button */}
					<div className="flex justify-center">
						<button
							type="button"
							onClick={() => setIsExtraExpanded(!isExtraExpanded)}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							aria-label={
								isExtraExpanded
									? "Collapse advanced options"
									: "Expand advanced options"
							}
						>
							<span className="text-sm font-medium">Advanced Settings</span>
							<i
								className={`fas fa-chevron-${isExtraExpanded ? "up" : "down"} transition-transform duration-200 text-xs`}
							></i>
						</button>
					</div>

					{/* Advanced Options Section */}
					<div
						className={`overflow-visible transition-all duration-300 ease-in-out ${isExtraExpanded ? "" : "hidden"}`}
					>
						<div className="flex flex-col gap-4">
							<div className="pb-2 border-b border-gray-200">
								<h1 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
									Advanced Settings
								</h1>
							</div>
							{/* Access Control Section */}
							<AccessControlSection
								data={accessControl}
								onChange={setAccessControl}
							/>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className="flex items-center justify-end border-t pt-4 mt-4 border-gray-200 gap-4">
					<Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" size="sm" loading={loading}>
						<i className="fas fa-link mr-2"></i>
						Create Short URL
					</Button>
				</div>
			</form>
		</Modal>
	);
};
