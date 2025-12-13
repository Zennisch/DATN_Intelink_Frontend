import { useState, useEffect } from "react";
import { useShortUrl } from "../../hooks/useShortUrl";
import { CreateShortUrlModal } from "../../components/url/CreateShortUrlModal.tsx";
import { ShortUrlList } from "../../components/shorturl/ShortUrlList.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import type {
	SearchShortUrlRequest,
} from "../../dto/request/ShortUrlRequest.ts";
import type { ShortUrlListResponse } from "../../dto/response/ShortUrlResponse.ts";

export const ShortUrlPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const {
		shortUrls,
		totalElements,
		totalPages,
		loading,
		error,
		fetchShortUrls,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		clearError,
	} = useShortUrl();

	// Fetch short URLs on component mount and when filters change
	useEffect(() => {
		const searchParams: SearchShortUrlRequest = {
			page: currentPage,
			size: 10,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(searchParams);
	}, [currentPage, searchQuery, statusFilter, fetchShortUrls]);

	// Handle search with debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setCurrentPage(0); // Reset to first page when searching
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery, statusFilter]);

	const handleSearch = () => {
		setCurrentPage(0);
		const searchParams: SearchShortUrlRequest = {
			page: 0,
			size: 10,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(searchParams);
	};

	const handleCreateSuccess = () => {
		setShowCreateModal(false);
		// Refresh the list
		const searchParams: SearchShortUrlRequest = {
			page: currentPage,
			size: 10,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(searchParams);
	};

	const handleEditShortUrl = (shortUrl: ShortUrlListResponse) => {
		// TODO: Implement edit functionality
		console.log("Edit short URL:", shortUrl);
	};

	const handleDeleteShortUrl = async (shortCode: string) => {
		if (window.confirm("Are you sure you want to delete this Short URL?")) {
			try {
				await deleteShortUrl(shortCode);
				// Refresh the list
				const searchParams: SearchShortUrlRequest = {
					page: currentPage,
					size: 10,
					query: searchQuery || undefined,
					status: statusFilter || undefined,
					sortBy: "createdAt",
					sortDirection: "desc",
				};
				fetchShortUrls(searchParams);
			} catch (error) {
				console.error("Error deleting short URL:", error);
			}
		}
	};

	const handleToggleStatus = async (
		shortCode: string,
		currentStatus: string,
	) => {
		try {
			const isEnabled = currentStatus === "ENABLED";
			if (isEnabled) {
				await disableShortUrl(shortCode);
			} else {
				await enableShortUrl(shortCode);
			}
			// Refresh the list
			const searchParams: SearchShortUrlRequest = {
				page: currentPage,
				size: 10,
				query: searchQuery || undefined,
				status: statusFilter || undefined,
				sortBy: "createdAt",
				sortDirection: "desc",
			};
			fetchShortUrls(searchParams);
		} catch (error) {
			console.error("Error toggling short URL status:", error);
		}
	};

	const handleViewStats = (shortCode: string) => {
		// TODO: Implement view stats functionality
		console.log("View stats for shortCode:", shortCode);
	};

	const handleClearFilters = () => {
		setSearchQuery("");
		setStatusFilter("");
		setCurrentPage(0);
	};

	return (
		<div className="space-y-2">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between">
					<span>{error}</span>
					<button
						onClick={clearError}
						className="text-red-500 hover:text-red-700"
					>
						×
					</button>
				</div>
			)}

			{/* Search, Filters and Create Button in one row */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
				<div className="flex flex-col md:flex-row gap-4 items-end">
					<div className="flex-1 md:flex-[2]">
						<Input
							type="text"
							placeholder="Search by original URL or short code..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-10"
						/>
					</div>
					<div className="flex-1">
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All statuses</option>
							<option value="ENABLED">Active</option>
							<option value="DISABLED">Disabled</option>
						</select>
					</div>
					<div className="flex gap-2">
						<Button
							onClick={handleSearch}
							variant="primary"
							className="h-10 px-4"
						>
							Search
						</Button>
						<Button
							onClick={handleClearFilters}
							variant="secondary"
							className="h-10 px-4"
						>
							Clear
						</Button>
					</div>
					<div>
						<Button
							onClick={() => setShowCreateModal(true)}
							className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-4"
						>
							<i className="fas fa-plus mr-2"></i>
							Create Short URL
						</Button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				{loading && !shortUrls.length ? (
					<div className="flex justify-center items-center py-8">
						<div className="text-gray-500">Loading...</div>
					</div>
				) : (
					<ShortUrlList
						shortUrls={shortUrls}
						loading={loading}
						onEdit={handleEditShortUrl}
						onDelete={handleDeleteShortUrl}
						onToggleStatus={handleToggleStatus}
						onViewStats={handleViewStats}
					/>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
						<div className="text-sm text-gray-500">
							Showing {currentPage * 10 + 1} -{" "}
							{Math.min((currentPage + 1) * 10, totalElements)} of{" "}
							{totalElements} results
						</div>

						<div className="flex gap-2">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
								disabled={currentPage === 0 || loading}
							>
								Previous
							</Button>

							{/* Page Numbers */}
							<div className="flex gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									// Calculate which pages to show
									let startPage = Math.max(0, currentPage - 2);
									startPage = Math.min(startPage, Math.max(0, totalPages - 5));

									const pageNum = startPage + i;

									return (
										<button
											key={`page-${pageNum}`}
											onClick={() => setCurrentPage(pageNum)}
											className={`px-3 py-1 text-sm rounded-md ${
												pageNum === currentPage
													? "bg-blue-600 text-white"
													: "bg-gray-100 text-gray-700 hover:bg-gray-200"
											}`}
										>
											{pageNum + 1}
										</button>
									);
								})}
							</div>

							<Button
								variant="secondary"
								size="sm"
								onClick={() =>
									setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
								}
								disabled={currentPage >= totalPages - 1 || loading}
							>
								Next
							</Button>
						</div>
					</div>
				)}
				<CreateShortUrlModal
					open={showCreateModal}
					onClose={() => setShowCreateModal(false)}
					onSuccess={handleCreateSuccess}
				/>
			</div>
		</div>
	);
};
