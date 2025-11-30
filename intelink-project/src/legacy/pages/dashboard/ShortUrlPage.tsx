import { useState, useEffect } from "react";
import { useShortUrl } from "../../hooks/useShortUrl.ts";
import { CreateShortUrlModal } from "../../components/shorturl/CreateShortUrlModal.tsx";
import { ShortUrlList } from "../../components/shorturl/ShortUrlList.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import type {
	SearchShortUrlRequest,
	CreateShortUrlRequest,
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
		createShortUrl,
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

	const handleCreateShortUrl = async (data: CreateShortUrlRequest) => {
		try {
			const result = await createShortUrl(data);
			if (result) {
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
			}
		} catch (error) {
			console.error("Error creating short URL:", error);
		}
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
		<div className="space-y-3 md:space-y-4">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-md flex items-center justify-between text-sm">
					<span>{error}</span>
					<button
						onClick={clearError}
						className="text-red-500 hover:text-red-700 text-xl ml-2"
					>
						×
					</button>
				</div>
			)}

			{/* Search, Filters and Create Button */}
			<div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-200">
				<div className="flex flex-col gap-3">
					{/* Search Input - Full width on all screens */}
					<div className="w-full">
						<Input
							type="text"
							placeholder="Search by original URL or short code..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full h-10"
						/>
					</div>
					
					{/* Filters and Buttons Row */}
					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
						{/* Status Filter */}
						<div className="flex-1">
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="">All statuses</option>
								<option value="ENABLED">Active</option>
								<option value="DISABLED">Disabled</option>
							</select>
						</div>
						
						{/* Action Buttons */}
						<div className="flex gap-2 sm:flex-shrink-0">
							<Button
								onClick={handleSearch}
								variant="primary"
								className="h-10 px-4 text-sm flex-1 sm:flex-none"
							>
								Search
							</Button>
							<Button
								onClick={handleClearFilters}
								variant="secondary"
								className="h-10 px-4 text-sm flex-1 sm:flex-none"
							>
								Clear
							</Button>
							<Button
								onClick={() => setShowCreateModal(true)}
								className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-3 md:px-4 text-sm whitespace-nowrap"
							>
								<i className="fas fa-plus mr-1 md:mr-2"></i>
								<span className="hidden sm:inline">Create</span>
								<span className="sm:hidden">New</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-6">
				{loading && !shortUrls.length ? (
					<div className="flex justify-center items-center py-8">
						<div className="text-gray-500 text-sm">Loading...</div>
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
					<div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 pt-4">
						<div className="text-xs md:text-sm text-gray-500 text-center sm:text-left">
							Showing {currentPage * 10 + 1} -{" "}
							{Math.min((currentPage + 1) * 10, totalElements)} of{" "}
							{totalElements} results
						</div>

						<div className="flex gap-2 flex-wrap justify-center">
							<Button
								variant="secondary"
								size="sm"
								onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
								disabled={currentPage === 0 || loading}
								className="text-xs md:text-sm"
							>
								Previous
							</Button>

							{/* Page Numbers - Hide on very small screens */}
							<div className="hidden xs:flex gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									// Calculate which pages to show
									let startPage = Math.max(0, currentPage - 2);
									startPage = Math.min(startPage, Math.max(0, totalPages - 5));

									const pageNum = startPage + i;

									return (
										<button
											key={`page-${pageNum}`}
											onClick={() => setCurrentPage(pageNum)}
											className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-md ${
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

							{/* Current page indicator for very small screens */}
							<div className="xs:hidden px-3 py-1 text-xs bg-gray-100 rounded-md">
								{currentPage + 1} / {totalPages}
							</div>

							<Button
								variant="secondary"
								size="sm"
								onClick={() =>
									setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
								}
								disabled={currentPage >= totalPages - 1 || loading}
								className="text-xs md:text-sm"
							>
								Next
							</Button>
						</div>
					</div>
				)}
				<CreateShortUrlModal
					isOpen={showCreateModal}
					onClose={() => setShowCreateModal(false)}
					onCreateShortUrl={handleCreateShortUrl}
					loading={loading}
				/>
			</div>
		</div>
	);
};
