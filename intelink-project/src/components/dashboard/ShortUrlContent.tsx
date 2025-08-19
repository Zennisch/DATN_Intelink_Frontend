import React, { useState, useEffect } from "react";
import { useShortUrls } from "../../hooks/useShortUrls";
import { CreateShortUrlForm } from "../shorturl/CreateShortUrlForm";
import { ShortUrlList } from "../shorturl/ShortUrlList";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useCreateShortUrl } from "../../contexts/CreateShortUrlContext";
import type {
	SearchShortUrlRequest,
	CreateShortUrlRequest,
} from "../../dto/request/ShortUrlRequest";
import type { ShortUrlListResponse } from "../../dto/response/ShortUrlResponse";

export const ShortUrlContent: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(0);

	const { showCreateForm, openCreateForm, closeCreateForm } = useCreateShortUrl();

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
	} = useShortUrls();

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
				closeCreateForm();
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
			const isActive = currentStatus === "true";
			if (isActive) {
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
		<div className="space-y-6">
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

			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Short URLs</h1>
					<p className="text-gray-600 mt-1">
						Manage and track your short URLs
					</p>
				</div>
				<Button
					onClick={openCreateForm}
					className="bg-blue-600 hover:bg-blue-700 text-white"
				>
					+ Create Short URL
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="md:col-span-2">
						<Input
							type="text"
							placeholder="Search by original URL or short code..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full"
						/>
					</div>
					<div>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All statuses</option>
							<option value="true">Active</option>
							<option value="false">Disabled</option>
						</select>
					</div>
					<div className="flex gap-2">
						<Button onClick={handleSearch} variant="primary" className="flex-1">
							Search
						</Button>
						<Button
							onClick={handleClearFilters}
							variant="secondary"
							className="flex-1"
						>
							Clear Filters
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
								onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
								disabled={currentPage === 0 || loading}
							>
								Previous
							</Button>

							{/* Page Numbers */}
							<div className="flex gap-1">
								{[...Array(Math.min(5, totalPages))].map((_, index) => {
									const pageNum = Math.max(
										0,
										Math.min(currentPage - 2 + index, totalPages - 1),
									);
									return (
										<button
											key={pageNum}
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
			</div>

			{/* Create Short URL Modal */}
			{showCreateForm && (
				<div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold text-gray-900">
									Create New Short URL
								</h2>
								<button
									onClick={closeCreateForm}
									className="text-gray-400 hover:text-gray-600"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
							<CreateShortUrlForm
								onSubmit={handleCreateShortUrl}
								onClose={closeCreateForm}
								loading={loading}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
