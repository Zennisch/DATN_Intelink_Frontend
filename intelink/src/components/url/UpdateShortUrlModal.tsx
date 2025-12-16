import { useState, useEffect } from "react";
import { Button, Checkbox, Input, Modal } from "../primary";
import {
	AccessControlSection,
	type AccessControlData,
} from "./AccessControlSection";
import { useShortUrl } from "../../hooks/useShortUrl";
import type { UpdateShortUrlRequest, ShortUrlResponse } from "../../dto/ShortUrlDTO";

interface UpdateShortUrlModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
	shortUrl: ShortUrlResponse;
}

export const UpdateShortUrlModal = ({
	open,
	onClose,
	onSuccess,
	shortUrl,
}: UpdateShortUrlModalProps) => {
	const { updateShortUrl, isLoading } = useShortUrl();
	
	const [isExtraExpanded, setIsExtraExpanded] = useState(false);
	
	const [hasAvailableDays, setHasAvailableDays] = useState(false);
	const [hasMaxUsage, setHasMaxUsage] = useState(false);
	const [hasPassword, setHasPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		originalUrl: "",
		title: "",
		description: "",
		availableDays: "",
		maxUsage: "",
		password: "",
	});

	const [accessControl, setAccessControl] = useState<AccessControlData>({
		mode: "allow",
		countries: [],
		ipRanges: [],
	});

	useEffect(() => {
		if (open && shortUrl) {
			setFormData({
				originalUrl: shortUrl.originalUrl || "",
				title: shortUrl.title || "",
				description: shortUrl.description || "",
				availableDays: shortUrl.expiresAt 
                    ? Math.ceil((new Date(shortUrl.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)).toString() 
                    : "",
				maxUsage: shortUrl.maxUsage?.toString() || "",
				password: "", // Don't fill password for security
			});

			setHasAvailableDays(!!shortUrl.expiresAt);
			setHasMaxUsage(!!shortUrl.maxUsage);
			setHasPassword(shortUrl.hasPassword);

			let mode: "allow" | "block" = "allow";
			const currentMode = shortUrl.accessControlMode as string;
			if (currentMode === 'WHITELIST' || currentMode === 'ALLOW') mode = 'allow';
			else if (currentMode === 'BLACKLIST' || currentMode === 'BLOCK') mode = 'block';

			setAccessControl({
				mode: mode,
				countries: shortUrl.accessControlGeographies || [],
				ipRanges: shortUrl.accessControlCIDRs || [],
			});
            
            // Expand extra settings if any are set
            if (!!shortUrl.expiresAt || !!shortUrl.maxUsage || shortUrl.hasPassword || 
                (shortUrl.accessControlGeographies && shortUrl.accessControlGeographies.length > 0) || 
                (shortUrl.accessControlCIDRs && shortUrl.accessControlCIDRs.length > 0)) {
                setIsExtraExpanded(true);
            }
		}
	}, [open, shortUrl]);

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
		const request: UpdateShortUrlRequest = {
			originalUrl: formData.originalUrl.trim(),
		};

		// Optional fields
		if (formData.title.trim() !== shortUrl.title) {
			request.title = formData.title.trim();
		}
		if (formData.description.trim() !== shortUrl.description) {
			request.description = formData.description.trim();
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
        // Always send access control data if it's being updated, or if we want to clear it?
        // The DTO says optional. If we don't send it, it might not update.
        // If we want to update, we should send the current state of the form.
        
        request.accessControlMode = accessControl.mode === 'allow' ? 'WHITELIST' : 'BLACKLIST';
        request.accessControlGeographies = accessControl.countries;
        request.accessControlCIDRs = accessControl.ipRanges;

		try {
			await updateShortUrl(shortUrl.shortCode, request);
			handleClose();
			onSuccess?.();
		} catch (err) {
			console.error('Failed to update short URL:', err);
			setError(err instanceof Error ? err.message : 'Failed to update short URL');
		}
	};

	const handleClose = () => {
        // Reset form is handled by useEffect when opening with new shortUrl
        // But we should clear error
		setError(null);
		onClose();
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={"Update Short URL"}
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
									wrapperClassName="w-full"
									inputClassName="w-full"
									helpText="Optional title for your link"
								/>
                                {/* Custom Code is not editable */}
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
										helpText="Update remaining days"
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
										label="New Password"
										type="password"
										placeholder={shortUrl.hasPassword ? "Enter new password to change" : "Enter protection password"}
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
					<Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" size="sm" loading={isLoading}>
						<i className="fas fa-save mr-2"></i>
						Update Short URL
					</Button>
				</div>
			</form>
		</Modal>
	);
};
