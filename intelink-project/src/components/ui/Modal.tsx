import { useEffect } from "react";
import { Button } from "./Button";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	children,
	title,
}) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			// Thêm nút Escape để đóng modal
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop with blur effect */}
			<div
				className="absolute inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
				onClick={onClose}
			/>

			{/* Modal content */}
			<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between p-6 border-b border-gray-200">
						<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
						<Button variant="secondary" onClick={onClose}>
							Đóng modal
						</Button>
					</div>
				)}

				{/* Body */}
				<div className={title ? "p-6" : "p-6"}>{children}</div>
			</div>
		</div>
	);
};
