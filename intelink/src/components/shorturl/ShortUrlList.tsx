import React, { useState } from "react";
import type { ShortUrlResponse } from "../../dto/ShortUrlDTO";
import { fixShortUrlFormat } from "../../utils/UrlUtil";

interface ShortUrlListProps {
	shortUrls: ShortUrlResponse[];
	loading?: boolean;
	onEdit?: (shortUrl: ShortUrlResponse) => void;
	onDelete?: (shortCode: string) => void;
	onToggleStatus?: (shortCode: string, currentStatus: string) => void;
	onViewStats?: (shortCode: string) => void;
}

export const ShortUrlList: React.FC<ShortUrlListProps> = ({
	shortUrls,
	loading = false,
	onDelete,
	onToggleStatus,
    onEdit,
    onViewStats
}) => {
	const [copiedId, setCopiedId] = useState<number | null>(null);

	const copyToClipboard = async (text: string, id: number) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (error) {
			console.error("Failed to copy to clipboard:", error);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

    const getStatus = (shortUrl: ShortUrlResponse) => {
        if (!shortUrl.enabled) return 'DISABLED';
        if (shortUrl.expiresAt && new Date(shortUrl.expiresAt) < new Date()) return 'EXPIRED';
        return 'ENABLED';
    };

	const getStatusBadge = (status: string) => {
		const statusClasses = {
			ENABLED: "bg-green-100 text-green-800",
			DISABLED: "bg-gray-100 text-gray-800",
			EXPIRED: "bg-red-100 text-red-800",
		};

		const statusLabels = {
			ENABLED: "Active",
			DISABLED: "Disabled",
			EXPIRED: "Expired",
		};

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.DISABLED}`}
			>
				{statusLabels[status as keyof typeof statusLabels] || status}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
					>
						<div className="space-y-3">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2"></div>
							<div className="h-3 bg-gray-200 rounded w-1/4"></div>
						</div>
					</div>
				))}
			</div>
		);
	}

	if (shortUrls.length === 0) {
		return (
			<div className="text-center py-12">
				<i className="fas fa-link mx-auto h-12 w-12 text-gray-400 text-5xl"></i>
				<h3 className="mt-2 text-sm font-medium text-gray-900">
					No Short URLs yet
				</h3>
				<p className="mt-1 text-sm text-gray-500">
					Get started by creating your first Short URL.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{shortUrls.map((shortUrl) => {
                const status = getStatus(shortUrl);
                return (
				<div
					key={shortUrl.id}
					className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
				>
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							{/* Short URL and Copy Button */}
							<div className="flex items-center gap-2 mb-2">
								<a
									href={fixShortUrlFormat(shortUrl.shortUrl)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 font-medium truncate"
								>
									intelink.click/{shortUrl.shortCode}
								</a>
								<button
									onClick={() =>
										copyToClipboard(
											fixShortUrlFormat(shortUrl.shortUrl),
											shortUrl.id,
										)
									}
									className="text-gray-400 hover:text-gray-600 transition-colors"
									title="Copy to clipboard"
								>
									{copiedId === shortUrl.id ? (
										<i className="fas fa-check w-4 h-4 text-green-500"></i>
									) : (
										<i className="fas fa-copy w-4 h-4"></i>
									)}
								</button>
							</div>

							{/* Original URL */}
							<p
								className="text-sm text-gray-600 truncate mb-2"
								title={shortUrl.originalUrl}
							>
								{shortUrl.originalUrl}
							</p>

							{/* Description */}
							{shortUrl.description && (
								<p className="text-sm text-gray-500 mb-2">
									{shortUrl.description}
								</p>
							)}

							{/* Stats and Info */}
							<div className="flex items-center gap-4 text-xs text-gray-500">
								<span className="flex items-center gap-1">
									<i className="fas fa-eye w-3 h-3"></i>
									{shortUrl.totalClicks} Clicks
								</span>

								{shortUrl.hasPassword && (
									<span className="flex items-center gap-1">
										<i className="fas fa-lock w-3 h-3"></i>
										Protected
									</span>
								)}

								{shortUrl.maxUsage && <span>Max: {shortUrl.maxUsage}</span>}

								<span>Created: {formatDate(shortUrl.createdAt)}</span>
								{shortUrl.expiresAt && <span>Expires: {formatDate(shortUrl.expiresAt)}</span>}
							</div>
						</div>

						{/* Status and Actions */}
						<div className="flex items-start gap-2 ml-4">
							{getStatusBadge(status)}

							{/* Actions Dropdown */}
							<div className="relative group">
								<button className="text-gray-400 hover:text-gray-600 transition-colors">
									<i className="fas fa-ellipsis-v w-5 h-5"></i>
								</button>

								{/* Dropdown Menu */}
								<div className="absolute right-0 top-5 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden group-hover:block">
									<div className="py-1">
										{onViewStats && (
											<button
												onClick={() => onViewStats(shortUrl.shortCode)}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												<i className="fas fa-chart-bar w-4 h-4"></i>
												View Statistics
											</button>
										)}

										{onEdit && (
											<button
												onClick={() => onEdit(shortUrl)}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												<i className="fas fa-edit w-4 h-4"></i>
												Edit
											</button>
										)}

										{onToggleStatus && (
											<button
												onClick={() =>
													onToggleStatus(shortUrl.shortCode, status)
												}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												{status === "ENABLED" ? (
													<>
														<i className="fas fa-ban w-4 h-4"></i>
														Disable
													</>
												) : (
													<>
														<i className="fas fa-check-circle w-4 h-4"></i>
														Enable
													</>
												)}
											</button>
										)}

										{onDelete && (
											<button
												onClick={() => onDelete(shortUrl.shortCode)}
												className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
											>
												<i className="fas fa-trash w-4 h-4"></i>
												Delete
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
            })}
		</div>
	);
};
