import { useState } from "react";
import { Button, Checkbox, Input, Modal } from "../primary";
import {
	AccessControlSection,
	type AccessControlData,
} from "./AccessControlSection";

interface CreateShortUrlModalProps {
	open: boolean;
	onClose: () => void;
}

export const CreateShortUrlModal = ({
	open,
	onClose,
}: CreateShortUrlModalProps) => {
	const [isExtraExpanded, setIsExtraExpanded] = useState(false);

	const [hasPassword, setHasPassword] = useState(false);
	const [hasAvailableDays, setHasAvailableDays] = useState(true);
	const [hasMaxUsage, setHasMaxUsage] = useState(false);

	const [formData, setFormData] = useState({
		originalUrl: "",
		customCode: "",
		password: "",
		availableDays: "30",
		maxUsage: "100",
	});

	const [accessControl, setAccessControl] = useState<AccessControlData>({
		mode: "allow",
		countries: [],
		ipRanges: [],
	});

	const handleInputChange =
		(field: keyof typeof formData) => (value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
		};

	const handleSubmit = () => {};

	const handleClose = () => {
		setFormData({
			originalUrl: "",
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
		setIsExtraExpanded(false);
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
				<div className="flex flex-1 flex-col gap-6">
					{/* Basic Settings Section */}
					<div className="flex flex-col gap-2">
						<div className="pb-2 border-b border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
								Basic Settings
							</h3>
						</div>
						<div className="flex flex-row gap-4">
							<Input
								label="Original URL"
								placeholder="https://example.com/your-very-long-url..."
								value={formData.originalUrl}
								onChange={(e) =>
									handleInputChange("originalUrl")(e.target.value)
								}
								wrapperClassName="w-9/12"
								inputClassName="w-full"
								helpText="Enter the full URL you want to shorten"
							/>
							<Input
								label="Custom Short Code"
								placeholder="my-custom-link"
								value={formData.customCode}
								onChange={(e) =>
									handleInputChange("customCode")(e.target.value)
								}
								wrapperClassName="w-3/12"
								inputClassName="w-full"
								helpText="Leave empty for auto-generated code"
							/>
						</div>
					</div>

					{/* Extra Settings Section */}
					<div className="flex flex-col gap-2">
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
									className={`field-container ${hasAvailableDays ? "expanded" : ""}`}
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
									className={`field-container ${hasMaxUsage ? "expanded" : ""}`}
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
									className={`field-container ${hasPassword ? "expanded" : ""}`}
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
					<Button type="button" variant="ghost" size="sm" onClick={handleClose}>
						Cancel
					</Button>
					<Button type="submit" variant="primary" size="sm">
						<i className="fas fa-link mr-2"></i>
						Create Short URL
					</Button>
				</div>
			</form>
		</Modal>
	);
};
