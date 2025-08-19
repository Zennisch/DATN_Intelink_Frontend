import React, { useState } from 'react';
import type { ShortUrlListResponse } from '../../dto/response/ShortUrlResponse';
import { fixShortUrlFormat } from '../../utils/UrlUtil';

interface ShortUrlListProps {
	shortUrls: ShortUrlListResponse[];
	loading?: boolean;
	onEdit?: (shortUrl: ShortUrlListResponse) => void;
	onDelete?: (shortCode: string) => void;
	onToggleStatus?: (shortCode: string, currentStatus: string) => void;
	onViewStats?: (shortCode: string) => void;
}

export const ShortUrlList: React.FC<ShortUrlListProps> = ({
	shortUrls,
	loading = false,
	onEdit,
	onDelete,
	onToggleStatus,
	onViewStats,
}) => {
	const [copiedId, setCopiedId] = useState<number | null>(null);

	const copyToClipboard = async (text: string, id: number) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusBadge = (status: string) => {
		const statusClasses = {
			ACTIVE: 'bg-green-100 text-green-800',
			INACTIVE: 'bg-gray-100 text-gray-800',
			EXPIRED: 'bg-red-100 text-red-800',
		};

		const statusLabels = {
			ACTIVE: 'Hoạt động',
			INACTIVE: 'Không hoạt động',
			EXPIRED: 'Hết hạn',
		};

		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status as keyof typeof statusClasses] || statusClasses.INACTIVE}`}>
				{statusLabels[status as keyof typeof statusLabels] || status}
			</span>
		);
	};

	if (loading) {
		return (
			<div className="space-y-4">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
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
				<svg
					className="mx-auto h-12 w-12 text-gray-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
					/>
				</svg>
				<h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có Short URL nào</h3>
				<p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo Short URL đầu tiên của bạn.</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{shortUrls.map((shortUrl) => (
				<div key={shortUrl.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
									{fixShortUrlFormat(shortUrl.shortUrl)}
								</a>
								<button
									onClick={() => copyToClipboard(fixShortUrlFormat(shortUrl.shortUrl), shortUrl.id)}
									className="text-gray-400 hover:text-gray-600 transition-colors"
									title="Copy to clipboard"
								>
									{copiedId === shortUrl.id ? (
										<svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
										</svg>
									) : (
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
									)}
								</button>
							</div>

							{/* Original URL */}
							<p className="text-sm text-gray-600 truncate mb-2" title={shortUrl.originalUrl}>
								{shortUrl.originalUrl}
							</p>

							{/* Description */}
							{shortUrl.description && (
								<p className="text-sm text-gray-500 mb-2">{shortUrl.description}</p>
							)}

							{/* Stats and Info */}
							<div className="flex items-center gap-4 text-xs text-gray-500">
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
									</svg>
									{shortUrl.totalClicks} lượt click
								</span>
								
								{shortUrl.hasPassword && (
									<span className="flex items-center gap-1">
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
										Bảo vệ
									</span>
								)}
								
								{shortUrl.maxUsage && (
									<span>Max: {shortUrl.maxUsage}</span>
								)}
								
								<span>Tạo: {formatDate(shortUrl.createdAt)}</span>
								<span>Hết hạn: {formatDate(shortUrl.expiresAt)}</span>
							</div>
						</div>

						{/* Status and Actions */}
						<div className="flex items-start gap-2 ml-4">
							{getStatusBadge(shortUrl.status)}
							
							{/* Actions Dropdown */}
							<div className="relative group">
								<button className="text-gray-400 hover:text-gray-600 transition-colors">
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
									</svg>
								</button>
								
								{/* Dropdown Menu */}
								<div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 hidden group-hover:block">
									<div className="py-1">
										{onViewStats && (
											<button
												onClick={() => onViewStats(shortUrl.shortCode)}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
												</svg>
												Xem thống kê
											</button>
										)}
										
										{onEdit && (
											<button
												onClick={() => onEdit(shortUrl)}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
												</svg>
												Chỉnh sửa
											</button>
										)}
										
										{onToggleStatus && (
											<button
												onClick={() => onToggleStatus(shortUrl.shortCode, shortUrl.status)}
												className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
											>
												{shortUrl.status === 'ACTIVE' ? (
													<>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
														</svg>
														Vô hiệu hóa
													</>
												) : (
													<>
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														Kích hoạt
													</>
												)}
											</button>
										)}
										
										{onDelete && (
											<button
												onClick={() => onDelete(shortUrl.shortCode)}
												className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
												</svg>
												Xóa
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
