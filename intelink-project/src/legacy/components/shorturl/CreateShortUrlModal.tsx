import { useState } from "react";
import type { CreateShortUrlRequest } from "../../dto/request/ShortUrlRequest.ts";
import { Modal } from "../ui/Modal.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import { Checkbox } from "../ui/Checkbox.tsx";

interface CreateShortUrlModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateShortUrl: (urlData: CreateShortUrlRequest) => Promise<void>;
	loading?: boolean;
}

export const CreateShortUrlModal: React.FC<CreateShortUrlModalProps> = ({
	isOpen,
	onClose,
	onCreateShortUrl,
	loading = false,
}) => {
	const [formData, setFormData] = useState<CreateShortUrlRequest>({
		originalUrl: "",
		password: "",
		description: "",
		maxUsage: undefined,
		availableDays: 30,
	});
	const [errors, setErrors] = useState<Partial<Record<keyof CreateShortUrlRequest, string>>>({});
	const [hasPassword, setHasPassword] = useState(false);
	const [hasMaxUsage, setHasMaxUsage] = useState(false);

	const validateForm = (): Partial<Record<keyof CreateShortUrlRequest, string>> => {
		const newErrors: Partial<Record<keyof CreateShortUrlRequest, string>> = {};

		// Validate originalUrl
		if (!formData.originalUrl.trim()) {
			newErrors.originalUrl = "URL gốc là bắt buộc";
		} else {
			try {
				new URL(formData.originalUrl);
			} catch {
				newErrors.originalUrl = "URL không hợp lệ";
			}
		}

		// Validate password if enabled
		if (hasPassword && (!formData.password || formData.password.length < 4)) {
			newErrors.password = "Mật khẩu phải có ít nhất 4 ký tự";
		}

		// Validate maxUsage if enabled
		if (hasMaxUsage && (!formData.maxUsage || formData.maxUsage < 1)) {
			newErrors.maxUsage = "Số lần sử dụng phải lớn hơn 0";
		}

		// Validate availableDays
		if (formData.availableDays < 1) {
			newErrors.availableDays = "Số ngày có hiệu lực phải lớn hơn 0";
		}

		return newErrors;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const formErrors = validateForm();
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		try {
			// Prepare request data
			const requestData: CreateShortUrlRequest = {
				originalUrl: formData.originalUrl.trim(),
				availableDays: formData.availableDays,
				description: formData.description?.trim() || undefined,
				password: hasPassword ? formData.password?.trim() : undefined,
				maxUsage: hasMaxUsage ? formData.maxUsage : undefined,
			};

			await onCreateShortUrl(requestData);
			handleClose();
		} catch (error) {
			console.error("Error in form submission:", error);
		}
	};

	const handleInputChange =
		(field: keyof CreateShortUrlRequest) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			let value: string | number = e.target.value;

			// Handle number fields
			if (field === 'availableDays' || field === 'maxUsage') {
				value = parseInt(value) || 0;
			}

			setFormData((prev) => ({ ...prev, [field]: value }));
			
			// Clear error for the field being updated
			if (errors[field]) {
				setErrors((prev) => ({ ...prev, [field]: undefined }));
			}
		};

	const handleClose = () => {
		if (!loading) {
			setFormData({
				originalUrl: "",
				password: "",
				description: "",
				maxUsage: undefined,
				availableDays: 30,
			});
			setErrors({});
			setHasPassword(false);
			setHasMaxUsage(false);
			onClose();
		}
	};

	const handlePasswordToggle = (checked: boolean) => {
		setHasPassword(checked);
		if (!checked) {
			setFormData(prev => ({ ...prev, password: "" }));
			setErrors(prev => ({ ...prev, password: undefined }));
		}
	};

	const handleMaxUsageToggle = (checked: boolean) => {
		setHasMaxUsage(checked);
		if (!checked) {
			setFormData(prev => ({ ...prev, maxUsage: undefined }));
			setErrors(prev => ({ ...prev, maxUsage: undefined }));
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Create Short URL">
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="Origignal URL*"
					placeholder="https://example.com/very-long-url..."
					value={formData.originalUrl}
					onChange={handleInputChange("originalUrl")}
					error={errors.originalUrl}
					fullWidth
					disabled={loading}
				/>

				<div className="w-full">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						placeholder="Mô tả ngắn gọn về URL này (tùy chọn)..."
						value={formData.description || ""}
						onChange={handleInputChange("description")}
						disabled={loading}
						rows={2}
						className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 resize-none"
					/>
				</div>

				<Input
					label="Available Days *"
					type="number"
					placeholder="30"
					value={formData.availableDays.toString()}
					onChange={handleInputChange("availableDays")}
					error={errors.availableDays}
					fullWidth
					disabled={loading}
					min="1"
				/>

				<div className="space-y-3">
					<Checkbox
						id="has-password"
						checked={hasPassword}
						onChange={handlePasswordToggle}
						label="Protect with Password"
					/>

					{hasPassword && (
						<Input
							label="Mật khẩu"
							type="password"
							placeholder="Nhập mật khẩu bảo vệ..."
							value={formData.password || ""}
							onChange={handleInputChange("password")}
							error={errors.password}
							fullWidth
							disabled={loading}
						/>
					)}
				</div>

				<div className="space-y-3">
					<Checkbox
						id="has-max-usage"
						checked={hasMaxUsage}
						onChange={handleMaxUsageToggle}
						label="Limit Maximum Usage"
					/>

					{hasMaxUsage && (
						<Input
							label="Số lần sử dụng tối đa"
							type="number"
							placeholder="100"
							value={formData.maxUsage?.toString() || ""}
							onChange={handleInputChange("maxUsage")}
							error={errors.maxUsage}
							fullWidth
							disabled={loading}
							min="1"
						/>
					)}
				</div>

				<div className="flex justify-end space-x-3 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={handleClose}
						disabled={loading}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						loading={loading}
						disabled={!formData.originalUrl.trim() || loading}
						className="min-w-[120px]"
					>
						Create Short URL
					</Button>
				</div>
			</form>
		</Modal>
	);
};
