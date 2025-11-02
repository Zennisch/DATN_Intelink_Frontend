import {
	forwardRef,
	type ReactNode,
	useEffect,
	useId,
	type HTMLAttributes,
} from "react";
import { cn, FOCUS_STYLES, TRANSITION, COLORS, SIZES } from "./utils.ts";

type Size =
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl"
	| "5xl"
	| "6xl"
	| "full";
type Position = "center" | "top" | "bottom";

const sizeClasses: Record<Size, string> = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
	"2xl": "max-w-2xl",
	"3xl": "max-w-3xl",
	"4xl": "max-w-4xl",
	"5xl": "max-w-5xl",
	"6xl": "max-w-6xl",
	full: "max-w-full",
};

const positionClasses: Record<Position, string> = {
	center: "items-center",
	top: "items-start pt-20",
	bottom: "items-end pb-20",
};

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	// Core behavior props
	open: boolean;

	// Content props
	title?: ReactNode;
	children: ReactNode;
	footer?: ReactNode;

	// Styling props
	size?: Size;
	position?: Position;

	// Layout props
	showCloseButton?: boolean;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;

	// State props
	loading?: boolean;

	// Callback props
	onClose?: () => void;

	// Styling override props
	overlayClassName?: string;
	containerClassName?: string;
	headerClassName?: string;
	bodyClassName?: string;
	footerClassName?: string;
}

export const Modal = forwardRef<HTMLDivElement, Props>(function Modal(
	{
		open,
		title,
		children,
		footer,
		size = "md",
		position = "center",
		showCloseButton = true,
		closeOnBackdropClick = true,
		closeOnEscape = true,
		loading = false,
		onClose,
		overlayClassName,
		containerClassName,
		headerClassName,
		bodyClassName,
		footerClassName,
		className,
		...props
	},
	ref,
) {
	const autoId = useId();
	const titleId = `${autoId}-title`;
	const descId = `${autoId}-desc`;

	// Handle escape key
	useEffect(() => {
		if (!open || !closeOnEscape || !onClose) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [open, closeOnEscape, onClose]);

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (open) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [open]);

	// Handle backdrop click
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
			onClose();
		}
	};

	if (!open) return null;

	const overlayClasses = cn(
		"fixed inset-0 z-50 flex",
		"bg-transparent backdrop-blur-sm",
		TRANSITION,
		positionClasses[position],
		"justify-center",
		"overflow-y-auto",
		overlayClassName,
	);

	const containerClasses = cn(
		"relative w-full",
		sizeClasses[size],
		"bg-white",
		SIZES.borderRadius,
		"shadow-xl",
		"m-4",
		"flex flex-col",
		"max-h-[90vh]",
		containerClassName,
		className,
	);

	const headerClasses = cn(
		"flex items-center justify-between",
		"px-6 py-4",
		"border-b border-gray-200",
		headerClassName,
	);

	const bodyClasses = cn(
		"px-6 py-4",
		"overflow-y-auto",
		"flex-1",
		bodyClassName,
	);

	const footerClasses = cn(
		"px-6 py-4",
		"border-t border-gray-200",
		"flex items-center justify-end gap-3",
		footerClassName,
	);

	const closeButtonClasses = cn(
		"p-1 rounded-lg",
		"text-gray-400 hover:text-gray-600",
		TRANSITION,
		FOCUS_STYLES,
		"disabled:opacity-50 disabled:cursor-not-allowed",
	);

	return (
		<div
			className={overlayClasses}
			onClick={handleBackdropClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? titleId : undefined}
			aria-describedby={descId}
		>
			<div ref={ref} className={containerClasses} {...props}>
				{/* Header */}
				{(title || showCloseButton) && (
					<div className={headerClasses}>
						{title && (
							<h2
								id={titleId}
								className={cn("text-lg font-semibold", COLORS.text.primary)}
							>
								{title}
							</h2>
						)}
						{showCloseButton && (
							<button
								type="button"
								className={closeButtonClasses}
								onClick={onClose}
								disabled={loading}
								aria-label="Close modal"
							>
								<svg
									className="w-5 h-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
				)}

				{/* Body */}
				<div id={descId} className={bodyClasses}>
					{children}
				</div>

				{/* Footer */}
				{footer && <div className={footerClasses}>{footer}</div>}

				{/* Loading overlay */}
				{loading && (
					<div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
						<svg
							className="animate-spin h-8 w-8 text-gray-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							role="img"
							aria-label="Loading"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
							></path>
						</svg>
					</div>
				)}
			</div>
		</div>
	);
});
