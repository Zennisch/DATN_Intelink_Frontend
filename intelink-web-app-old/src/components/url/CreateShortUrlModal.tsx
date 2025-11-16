import { useState } from "react";
import { Modal } from "../primary";
import { CreateShortUrlForm } from "./CreateShortUrlForm";
import { CreateShortUrlFooter } from "./CreateShortUrlFooter";
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

	// Form state (UI only - no validation logic)
	const [formData, setFormData] = useState({
		originalUrl: "",
		customCode: "",
		password: "",
		availableDays: "30",
		maxUsage: "",
	});

	// Access Control state
	const [accessControl, setAccessControl] = useState<AccessControlData>({
		mode: "allow",
		countries: [],
		ipRanges: [],
	});

	const handleInputChange =
		(field: keyof typeof formData) => (value: string) => {
			setFormData((prev) => ({ ...prev, [field]: value }));
		};

	const handleClose = () => {
		setFormData({
			originalUrl: "",
			customCode: "",
			password: "",
			availableDays: "30",
			maxUsage: "",
		});
		setAccessControl({
			mode: "allow",
			countries: [],
			ipRanges: [],
		});
		setIsExtraExpanded(false);
		onClose();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Logic will be implemented later
		console.log("Form submitted:", formData);
		console.log("Access Control:", accessControl);
	};

	// Debug function to log access control data
	const handleDebugLog = () => {
		console.log("Access Control Data:", accessControl);
		alert(JSON.stringify(accessControl, null, 2));
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title="Create Short URL"
			size="xl"
			className="transition-all duration-200 overflow-y-auto"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Main Content - Always Visible */}
				<CreateShortUrlForm
					formData={formData}
					onInputChange={handleInputChange}
				/>

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
						<span className="text-sm font-medium">Advanced Options</span>
						<i
							className={`fas fa-chevron-${isExtraExpanded ? "up" : "down"} transition-transform duration-200 text-xs`}
						></i>
					</button>
				</div>

				{/* Extra Section - Collapsible */}
				<div
					className={`overflow-visible transition-all duration-300 ease-in-out ${
						isExtraExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
					}`}
				>
					<div className="space-y-5 pt-2">
						{/* Access Control Section */}
						<AccessControlSection
							data={accessControl}
							onChange={setAccessControl}
						/>
					</div>
				</div>

				{/* Footer Actions */}
				<CreateShortUrlFooter
					onCancel={handleClose}
					onDebugLog={handleDebugLog} // Comment this line to hide debug button
				/>
			</form>
		</Modal>
	);
};
