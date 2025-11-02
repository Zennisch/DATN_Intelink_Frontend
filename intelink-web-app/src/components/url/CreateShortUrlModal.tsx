import { useState } from "react";
import { Modal } from "../primary";
import { CreateShortUrlForm } from "./CreateShortUrlForm";
import { CreateShortUrlFooter } from "./CreateShortUrlFooter";
import { AccessControlExample } from "./AccessControlExample";

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
		setIsExtraExpanded(false);
		onClose();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Logic will be implemented later
		console.log("Form submitted:", formData);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title="Create Short URL"
			size={isExtraExpanded ? "full" : "2xl"}
			className="transition-all duration-200"
		>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Main Content Grid */}
				<div className="flex gap-6 relative">
					{/* Default Section */}
					<CreateShortUrlForm
						formData={formData}
						onInputChange={handleInputChange}
					/>

					{/* Expand/Collapse Button */}
					<div className="flex items-start">
						<button
							type="button"
							onClick={() => setIsExtraExpanded(!isExtraExpanded)}
							className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							aria-label={
								isExtraExpanded
									? "Collapse extra options"
									: "Expand extra options"
							}
						>
							<i
								className={`fas fa-chevron-${isExtraExpanded ? "left" : "right"} transition-transform duration-200`}
							></i>
						</button>
					</div>

					{/* Extra Section */}
					<div
						className={`flex-1 overflow-hidden transition-all duration-200 ease-in-out ${
							isExtraExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
						}`}
					>
						<div className="space-y-5">
							<div className="pb-3 border-b border-gray-200">
								<h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
									Advanced Options
								</h3>
							</div>

							{/* Placeholder for future features */}
							{/* <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
								<div className="text-center space-y-2">
									<i className="fas fa-magic text-4xl text-gray-400"></i>
									<p className="text-gray-500 text-sm font-medium">
										Advanced features coming soon
									</p>
									<p className="text-gray-400 text-xs">
										Tags, QR codes, expiration time, and more...
									</p>
								</div>
							</div> */}
              <AccessControlExample />
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<CreateShortUrlFooter onCancel={handleClose} />
			</form>
		</Modal>
	);
};
