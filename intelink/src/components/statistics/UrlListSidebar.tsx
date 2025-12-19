import React, { useEffect, useState } from "react";
import { ShortUrlService } from "../../services/ShortUrlService";
import type { ShortUrlResponse } from "../../dto/ShortUrlDTO";

interface UrlListSidebarProps {
	selectedUrl: string | null;
	onUrlSelect: (shortCode: string, url: ShortUrlResponse) => void;
	className?: string;
	onClose?: () => void;
	variant?: 'sidebar' | 'horizontal';
}

export const UrlListSidebar: React.FC<UrlListSidebarProps> = ({
	selectedUrl,
	onUrlSelect,
	className = "",
	onClose,
	variant = 'sidebar',
}) => {
	const [shortUrls, setShortUrls] = useState<ShortUrlResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const pageSize = 10; // Reduced size for better pagination UX in sidebar

	useEffect(() => {
		const fetchUrls = async () => {
			setLoading(true);
			try {
				const response = await ShortUrlService.searchShortUrls({
					page: page,
					size: pageSize,
					sortBy: "createdAt",
					direction: "desc",
				});
				setShortUrls(response.content);
				setTotalPages(response.totalPages);
			} catch (err: unknown) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Failed to fetch URLs");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchUrls();
	}, [page]);

	const handlePrevPage = () => {
		if (page > 0) {
			setPage(page - 1);
		}
	};

	const handleNextPage = () => {
		if (page < totalPages - 1) {
			setPage(page + 1);
		}
	};

	if (loading && page === 0 && shortUrls.length === 0) {
		if (variant === 'horizontal') {
			return (
				<div className={`bg-white border-b border-gray-200 w-full p-2 overflow-hidden ${className}`}>
					<div className="flex space-x-3 overflow-x-auto">
						{[...Array(3)].map((_, index) => (
							<div key={index} className="animate-pulse min-w-[200px] h-20 bg-gray-100 rounded-lg p-2">
								<div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-2 bg-gray-200 rounded w-1/2"></div>
							</div>
						))}
					</div>
				</div>
			);
		}
		return (
			<div className={`bg-white border-r border-gray-200 w-80 p-4 h-full overflow-hidden ${className}`}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
					{onClose && (
						<button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
							<i className="fas fa-times text-xl"></i>
						</button>
					)}
				</div>
				<div className="space-y-3">
					{[...Array(6)].map((_, index) => (
						<div key={index} className="animate-pulse">
							<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
							<div className="h-3 bg-gray-200 rounded w-1/3"></div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={`bg-white ${variant === 'sidebar' ? 'border-r w-80 h-full' : 'border-b w-full'} border-gray-200 p-4 ${className}`}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
					{onClose && variant === 'sidebar' && (
						<button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
							<i className="fas fa-times text-xl"></i>
						</button>
					)}
				</div>
				<div className="text-red-600 text-sm">
					Error loading URLs: {error}
				</div>
			</div>
		);
	}

	if (variant === 'horizontal') {
		return (
			<div className={`bg-white border-b border-gray-200 w-full flex flex-col ${className}`}>
				<div className="flex items-center p-2">
					<button
						onClick={handlePrevPage}
						disabled={page === 0 || loading}
						className={`p-2 rounded-md flex-shrink-0 ${
							page === 0 || loading
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<div className="flex-1 overflow-x-auto flex space-x-3 px-2 py-1 no-scrollbar">
						{shortUrls.length === 0 ? (
							<div className="text-sm text-gray-500 whitespace-nowrap m-auto">No URLs found</div>
						) : (
							shortUrls.map((shortUrl) => (
								<div
									key={shortUrl.id}
									onClick={() => onUrlSelect(shortUrl.shortCode, shortUrl)}
									className={`
										cursor-pointer border rounded-lg p-2 min-w-[160px] max-w-[160px] flex-shrink-0 transition-all duration-200
										${
											selectedUrl === shortUrl.shortCode
												? "border-blue-500 bg-blue-50 shadow-sm"
												: "border-gray-200 hover:border-gray-300"
										}
									`}
								>
									<div className="flex items-center justify-between mb-1">
										<span className="font-medium text-gray-900 truncate text-sm" title={shortUrl.shortCode}>
											{shortUrl.shortCode}
										</span>
										<div className={`w-2 h-2 rounded-full ${shortUrl.enabled ? "bg-green-500" : "bg-gray-400"}`} />
									</div>
									<div className="text-xs text-gray-500 truncate" title={shortUrl.originalUrl}>
										{shortUrl.originalUrl}
									</div>
								</div>
							))
						)}
					</div>

					<button
						onClick={handleNextPage}
						disabled={page >= totalPages - 1 || loading}
						className={`p-2 rounded-md flex-shrink-0 ${
							page >= totalPages - 1 || loading
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-100"
						}`}
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className={`bg-white border-r border-gray-200 w-80 flex flex-col h-full ${className}`}>
			<div className="p-4 border-b border-gray-200 flex justify-between items-start">
				<div>
					<h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
					<p className="text-sm text-gray-500 mt-1">
						Select a URL to view statistics
					</p>
				</div>
				{onClose && (
					<button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 p-1">
						<i className="fas fa-times text-xl"></i>
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-4">
				{shortUrls.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-sm text-gray-500">No URLs found</p>
					</div>
				) : (
					<div className="space-y-3">
						{shortUrls.map((shortUrl) => (
							<div
								key={shortUrl.id}
								onClick={() => onUrlSelect(shortUrl.shortCode, shortUrl)}
								className={`
								cursor-pointer border rounded-lg p-3 transition-all duration-200
								${
									selectedUrl === shortUrl.shortCode
										? "border-blue-500 bg-blue-50 shadow-sm"
										: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
								}
							`}
							>
								<div className="flex items-center justify-between mb-2">
									<span
										className="font-medium text-gray-900 truncate"
										title={shortUrl.shortCode}
									>
										{shortUrl.shortCode}
									</span>
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											shortUrl.enabled
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										{shortUrl.enabled ? "Active" : "Inactive"}
									</span>
								</div>
								<div
									className="text-sm text-gray-500 truncate"
									title={shortUrl.originalUrl}
								>
									{shortUrl.originalUrl}
								</div>
								<div className="mt-2 flex items-center text-xs text-gray-400">
									<svg
										className="w-3 h-3 mr-1"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
									{new Date(shortUrl.createdAt).toLocaleDateString()}
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Pagination Controls */}
			<div className="p-4 border-t border-gray-200 bg-gray-50">
				<div className="flex items-center justify-between">
					<button
						onClick={handlePrevPage}
						disabled={page === 0 || loading}
						className={`p-2 rounded-md ${
							page === 0 || loading
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-200"
						}`}
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
					<span className="text-sm text-gray-600">
						Page {page + 1} of {totalPages || 1}
					</span>
					<button
						onClick={handleNextPage}
						disabled={page >= totalPages - 1 || loading}
						className={`p-2 rounded-md ${
							page >= totalPages - 1 || loading
								? "text-gray-300 cursor-not-allowed"
								: "text-gray-600 hover:bg-gray-200"
						}`}
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};
