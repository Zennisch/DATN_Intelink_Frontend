import React, { useEffect } from "react";
import { useShortUrl } from "../../hooks/useShortUrl";
import { fixShortUrlFormat } from "../../utils/UrlUtil";
import type { ShortUrlListResponse } from "../../dto/response/ShortUrlResponse";
import { ShortUrlStatus } from "../../types/enums";

interface UrlListSidebarProps {
	selectedUrl: string | null;
	onUrlSelect: (shortCode: string, url: ShortUrlListResponse) => void;
}

export const UrlListSidebar: React.FC<UrlListSidebarProps> = ({
	selectedUrl,
	onUrlSelect,
}) => {
	const { shortUrls, loading, error, fetchShortUrls } = useShortUrl();

	useEffect(() => {
		// Fetch URLs when component mounts
		fetchShortUrls({
			page: 0,
			size: 50, // Get more URLs for statistics
			sortBy: "createdAt",
			sortDirection: "desc",
		});
	}, [fetchShortUrls]);

	if (loading) {
		return (
			<div className="bg-white border-r border-gray-200 w-80 p-4">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Your URLs</h2>
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
			<div className="bg-white border-r border-gray-200 w-80 p-4">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Your URLs</h2>
				<div className="text-red-600 text-sm">
					Error loading URLs: {error}
				</div>
			</div>
		);
	}

	if (shortUrls.length === 0) {
		return (
			<div className="bg-white border-r border-gray-200 w-80 p-4">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">Your URLs</h2>
				<div className="text-center py-8">
					<svg
						className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
					<p className="text-sm text-gray-500">No URLs found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white border-r border-gray-200 w-80 flex flex-col">
			<div className="p-4 border-b border-gray-200">
				<h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
				<p className="text-sm text-gray-500 mt-1">
					Select a URL to view statistics
				</p>
			</div>
			
			<div className="flex-1 overflow-y-auto p-4">
				<div className="space-y-3">
					{shortUrls.map((shortUrl) => (
						<div
							key={shortUrl.id}
							onClick={() => onUrlSelect(shortUrl.shortCode, shortUrl)}
							className={`
								cursor-pointer border rounded-lg p-3 transition-all duration-200
								${selectedUrl === shortUrl.shortCode
									? "border-blue-500 bg-blue-50 shadow-sm"
									: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
								}
							`}
						>
							{/* Short URL */}
							<div className="flex items-center gap-2 mb-2">
								<a
									href={fixShortUrlFormat(shortUrl.shortUrl)}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate flex-1"
									title={fixShortUrlFormat(shortUrl.shortUrl)}
								>
									{fixShortUrlFormat(shortUrl.shortUrl)}
								</a>
								<span className={`
									text-xs px-2 py-1 rounded-full
									${shortUrl.status === ShortUrlStatus.ENABLED 
										? "bg-green-100 text-green-800" 
										: "bg-red-100 text-red-800"
									}
								`}>
									{shortUrl.status}
								</span>
							</div>

							{/* Original URL */}
							<p
								className="text-xs text-gray-600 truncate mb-2"
								title={shortUrl.originalUrl}
							>
								{shortUrl.originalUrl}
							</p>

							{/* Stats */}
							<div className="flex items-center justify-between text-xs text-gray-500">
								<span className="flex items-center gap-1">
									<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
										<path
											fillRule="evenodd"
											d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
											clipRule="evenodd"
										/>
									</svg>
									{shortUrl.totalClicks}
								</span>
								<span>
									{new Date(shortUrl.createdAt).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</span>
							</div>

							{/* Description */}
							{shortUrl.description && (
								<p className="text-xs text-gray-500 mt-2 truncate">
									{shortUrl.description}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
