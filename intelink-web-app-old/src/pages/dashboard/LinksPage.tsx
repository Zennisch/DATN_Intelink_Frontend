import { useState, useEffect } from "react";
import { useShortUrl } from "../../hooks/useShortUrl";
import type { SearchShortUrlRequest } from "../../dto/request/ShortUrlRequest";
import type { ShortUrlListResponse } from "../../dto/response/ShortUrlResponse";

interface LinksPageProps {}

export const LinksPage = ({}: LinksPageProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [selectedUrls, setSelectedUrls] = useState<Set<number>>(new Set());

	const {
		shortUrls,
		totalElements,
		totalPages,
		currentPage,
		loading,
		error,
		fetchShortUrls,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		clearError,
	} = useShortUrl();

	// Fetch URLs on mount and filter changes
	useEffect(() => {
		const params: SearchShortUrlRequest = {
			page: currentPage,
			size: 12,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(params);
	}, [currentPage, searchQuery, statusFilter, fetchShortUrls]);

	// Debounced search
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (searchQuery) {
				fetchShortUrls({
					page: 0,
					size: 12,
					query: searchQuery,
					status: statusFilter || undefined,
					sortBy: "createdAt",
					sortDirection: "desc",
				});
			}
		}, 500);
		return () => clearTimeout(timeout);
	}, [searchQuery]);

	const handleToggleStatus = async (shortCode: string, status: string) => {
		try {
			if (status === "ENABLED") {
				await disableShortUrl(shortCode);
			} else {
				await enableShortUrl(shortCode);
			}
		} catch (err) {
			console.error("Error toggling status:", err);
		}
	};

	const handleDelete = async (shortCode: string) => {
		if (window.confirm("Are you sure you want to delete this link?")) {
			await deleteShortUrl(shortCode);
		}
	};

	const handleCopyLink = (shortUrl: string) => {
		navigator.clipboard.writeText(shortUrl);
		// TODO: Show toast notification
	};

	const toggleSelectUrl = (id: number) => {
		const newSet = new Set(selectedUrls);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setSelectedUrls(newSet);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getStatusColor = (status: string) => {
		return status === "ENABLED"
			? "bg-green-100 text-green-800"
			: "bg-gray-100 text-gray-800";
	};

	const truncateUrl = (url: string, maxLength: number = 50) => {
		return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			{/* Header Section */}
			<div className="bg-white border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">
								Your Links
							</h1>
							<p className="text-sm text-gray-500 mt-1">
								Manage and monitor your shortened URLs
							</p>
						</div>
						<div className="flex items-center gap-3">
							<span className="text-sm text-gray-600">
								{totalElements} {totalElements === 1 ? "link" : "links"}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Error Banner */}
			{error && (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
					<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<i className="fas fa-exclamation-circle text-red-500"></i>
								<span className="text-red-800 text-sm font-medium">
									{error}
								</span>
							</div>
							<button
								onClick={clearError}
								className="text-red-500 hover:text-red-700 transition-colors"
							>
								<i className="fas fa-times"></i>
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Filters & Controls */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
					<div className="flex flex-col lg:flex-row gap-4">
						{/* Search */}
						<div className="flex-1">
							<div className="relative">
								<i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
								<input
									type="text"
									placeholder="Search by URL or short code..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								/>
							</div>
						</div>

						{/* Status Filter */}
						<div className="relative">
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-pointer"
							>
								<option value="">All Status</option>
								<option value="ENABLED">Active</option>
								<option value="DISABLED">Disabled</option>
							</select>
							<i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
						</div>

						{/* View Mode Toggle */}
						<div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
							<button
								onClick={() => setViewMode("grid")}
								className={`px-3 py-2 rounded-md transition-all ${
									viewMode === "grid"
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="Grid View"
							>
								<i className="fas fa-grip"></i>
							</button>
							<button
								onClick={() => setViewMode("list")}
								className={`px-3 py-2 rounded-md transition-all ${
									viewMode === "list"
										? "bg-white text-blue-600 shadow-sm"
										: "text-gray-600 hover:text-gray-900"
								}`}
								title="List View"
							>
								<i className="fas fa-list"></i>
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
				{loading && shortUrls.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
						<p className="text-gray-500 mt-4">Loading your links...</p>
					</div>
				) : shortUrls.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<i className="fas fa-link text-gray-400 text-3xl"></i>
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							No links found
						</h3>
						<p className="text-gray-500">
							{searchQuery || statusFilter
								? "Try adjusting your filters"
								: "Create your first short URL to get started"}
						</p>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{shortUrls.map((url) => (
							<LinkCard
								key={url.id}
								url={url}
								isSelected={selectedUrls.has(url.id)}
								onToggleSelect={() => toggleSelectUrl(url.id)}
								onToggleStatus={handleToggleStatus}
								onDelete={handleDelete}
								onCopy={handleCopyLink}
								formatDate={formatDate}
								getStatusColor={getStatusColor}
								truncateUrl={truncateUrl}
							/>
						))}
					</div>
				) : (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 border-b border-gray-200">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Link
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Clicks
										</th>
										<th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Created
										</th>
										<th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{shortUrls.map((url) => (
										<LinkRow
											key={url.id}
											url={url}
											onToggleStatus={handleToggleStatus}
											onDelete={handleDelete}
											onCopy={handleCopyLink}
											formatDate={formatDate}
											getStatusColor={getStatusColor}
											truncateUrl={truncateUrl}
										/>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6 flex items-center justify-center gap-2">
						<button
							disabled={currentPage === 0}
							onClick={() =>
								fetchShortUrls({
									page: currentPage - 1,
									size: 12,
									query: searchQuery || undefined,
									status: statusFilter || undefined,
								})
							}
							className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<i className="fas fa-chevron-left"></i>
						</button>

						<div className="flex gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const page = Math.max(
									0,
									Math.min(
										currentPage - 2 + i,
										totalPages - 5 + i,
									),
								);
								if (page >= totalPages) return null;

								return (
									<button
										key={page}
										onClick={() =>
											fetchShortUrls({
												page,
												size: 12,
												query: searchQuery || undefined,
												status: statusFilter || undefined,
											})
										}
										className={`px-4 py-2 rounded-lg transition-all ${
											page === currentPage
												? "bg-blue-600 text-white shadow-md"
												: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
										}`}
									>
										{page + 1}
									</button>
								);
							})}
						</div>

						<button
							disabled={currentPage >= totalPages - 1}
							onClick={() =>
								fetchShortUrls({
									page: currentPage + 1,
									size: 12,
									query: searchQuery || undefined,
									status: statusFilter || undefined,
								})
							}
							className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<i className="fas fa-chevron-right"></i>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

// Grid Card Component
interface LinkCardProps {
	url: ShortUrlListResponse;
	isSelected: boolean;
	onToggleSelect: () => void;
	onToggleStatus: (shortCode: string, status: string) => void;
	onDelete: (shortCode: string) => void;
	onCopy: (shortUrl: string) => void;
	formatDate: (date: string) => string;
	getStatusColor: (status: string) => string;
	truncateUrl: (url: string, maxLength?: number) => string;
}

const LinkCard = ({
	url,
	isSelected,
	onToggleSelect,
	onToggleStatus,
	onDelete,
	onCopy,
	formatDate,
	getStatusColor,
	truncateUrl,
}: LinkCardProps) => {
	const [showActions, setShowActions] = useState(false);

	return (
		<div
			className={`bg-white rounded-xl border-2 transition-all duration-200 hover:shadow-lg group ${
				isSelected ? "border-blue-500 shadow-md" : "border-gray-200"
			}`}
			onMouseEnter={() => setShowActions(true)}
			onMouseLeave={() => setShowActions(false)}
		>
			{/* Card Header */}
			<div className="p-5 border-b border-gray-100">
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<span
								className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(url.status)}`}
							>
								{url.status === "ENABLED" ? "Active" : "Disabled"}
							</span>
							{url.hasPassword && (
								<span className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
									<i className="fas fa-lock text-xs"></i>
									Protected
								</span>
							)}
						</div>
						<h3 className="text-lg font-bold text-gray-900 truncate">
							/{url.shortCode}
						</h3>
					</div>
					<button
						onClick={onToggleSelect}
						className={`shrink-0 w-6 h-6 rounded-md border-2 transition-all ${
							isSelected
								? "bg-blue-600 border-blue-600"
								: "border-gray-300 hover:border-blue-400"
						}`}
					>
						{isSelected && (
							<i className="fas fa-check text-white text-xs"></i>
						)}
					</button>
				</div>
			</div>

			{/* Card Body */}
			<div className="p-5">
				<div className="space-y-4">
					{/* Original URL */}
					<div>
						<p className="text-xs font-medium text-gray-500 mb-1">
							Target URL
						</p>
						<a
							href={url.originalUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-600 hover:text-blue-700 hover:underline break-all line-clamp-2"
							title={url.originalUrl}
						>
							{url.originalUrl}
						</a>
					</div>

					{/* Stats */}
					<div className="flex items-center justify-between pt-3 border-t border-gray-100">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<i className="fas fa-mouse-pointer text-gray-400 text-sm"></i>
								<span className="text-sm font-semibold text-gray-900">
									{url.totalClicks}
								</span>
								<span className="text-xs text-gray-500">clicks</span>
							</div>
						</div>
						<div className="text-xs text-gray-500">
							{formatDate(url.createdAt)}
						</div>
					</div>
				</div>
			</div>

			{/* Card Footer - Actions */}
			<div
				className={`px-5 pb-5 transition-all duration-200 ${
					showActions ? "opacity-100" : "opacity-0"
				}`}
			>
				<div className="flex items-center gap-2">
					<button
						onClick={() => onCopy(url.shortUrl)}
						className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
					>
						<i className="fas fa-copy"></i>
						Copy
					</button>
					<button
						onClick={() => onToggleStatus(url.shortCode, url.status)}
						className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors"
						title={
							url.status === "ENABLED" ? "Disable link" : "Enable link"
						}
					>
						<i
							className={`fas fa-${url.status === "ENABLED" ? "pause" : "play"}`}
						></i>
					</button>
					<button
						onClick={() => onDelete(url.shortCode)}
						className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm transition-colors"
						title="Delete link"
					>
						<i className="fas fa-trash"></i>
					</button>
				</div>
			</div>
		</div>
	);
};

// List Row Component
interface LinkRowProps {
	url: ShortUrlListResponse;
	onToggleStatus: (shortCode: string, status: string) => void;
	onDelete: (shortCode: string) => void;
	onCopy: (shortUrl: string) => void;
	formatDate: (date: string) => string;
	getStatusColor: (status: string) => string;
	truncateUrl: (url: string, maxLength?: number) => string;
}

const LinkRow = ({
	url,
	onToggleStatus,
	onDelete,
	onCopy,
	formatDate,
	getStatusColor,
	truncateUrl,
}: LinkRowProps) => {
	return (
		<tr className="hover:bg-gray-50 transition-colors">
			<td className="px-6 py-4">
				<div className="flex items-start gap-3">
					<div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
						<i className="fas fa-link text-white text-sm"></i>
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span className="font-semibold text-gray-900">
								/{url.shortCode}
							</span>
							{url.hasPassword && (
								<i
									className="fas fa-lock text-purple-500 text-xs"
									title="Password protected"
								></i>
							)}
						</div>
						<a
							href={url.originalUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-gray-600 hover:text-blue-600 hover:underline truncate block"
							title={url.originalUrl}
						>
							{truncateUrl(url.originalUrl, 60)}
						</a>
					</div>
				</div>
			</td>
			<td className="px-6 py-4">
				<span
					className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(url.status)}`}
				>
					{url.status === "ENABLED" ? "Active" : "Disabled"}
				</span>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center gap-2">
					<i className="fas fa-mouse-pointer text-gray-400 text-sm"></i>
					<span className="font-semibold text-gray-900">
						{url.totalClicks}
					</span>
				</div>
			</td>
			<td className="px-6 py-4">
				<span className="text-sm text-gray-600">
					{formatDate(url.createdAt)}
				</span>
			</td>
			<td className="px-6 py-4">
				<div className="flex items-center justify-end gap-2">
					<button
						onClick={() => onCopy(url.shortUrl)}
						className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
						title="Copy link"
					>
						<i className="fas fa-copy"></i>
					</button>
					<button
						onClick={() => onToggleStatus(url.shortCode, url.status)}
						className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
						title={
							url.status === "ENABLED" ? "Disable link" : "Enable link"
						}
					>
						<i
							className={`fas fa-${url.status === "ENABLED" ? "pause" : "play"}`}
						></i>
					</button>
					<button
						onClick={() => onDelete(url.shortCode)}
						className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
						title="Delete link"
					>
						<i className="fas fa-trash"></i>
					</button>
				</div>
			</td>
		</tr>
	);
};
