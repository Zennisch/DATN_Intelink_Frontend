import React, { useState, useEffect } from "react";
import { useShortUrl } from "../hooks/useShortUrl.ts";
import { CreateShortUrlForm } from "../components/shorturl/CreateShortUrlForm";
import { ShortUrlList } from "../components/shorturl/ShortUrlList";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import type { SearchShortUrlRequest } from "../dto/request/ShortUrlRequest";
import type { ShortUrlListResponse } from "../dto/response/ShortUrlResponse";

export const ShortUrlPage: React.FC = () => {
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(0);

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

	const handleCreateShortUrl = async (data: any) => {
		const result = await createShortUrl(data);
		if (result) {
			setShowCreateForm(false);
			clearError();
		}
	};

	const handleDeleteShortUrl = async (shortCode: string) => {
		if (window.confirm("Are you sure you want to delete this Short URL?")) {
			await deleteShortUrl(shortCode);
		}
	};

	const handleToggleStatus = async (
		shortCode: string,
		currentStatus: string,
	) => {
		if (currentStatus === "ACTIVE") {
			await disableShortUrl(shortCode);
		} else {
			await enableShortUrl(shortCode);
		}
	};

	const handleEditShortUrl = (shortUrl: ShortUrlListResponse) => {
		// TODO: Implement edit functionality
		console.log("Edit short URL:", shortUrl);
	};

	const handleViewStats = (shortCode: string) => {
		// TODO: Implement stats view
		console.log("View stats for short URL:", shortCode);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Short URLs</h1>
							<p className="mt-2 text-gray-600">
								Manage and track your Short URLs
							</p>
						</div>
						<Button
							onClick={() => setShowCreateForm(true)}
							className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
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
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Create Short URL
						</Button>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search Input */}
						<div className="flex-1">
							<Input
								label="Search"
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search by URL, description..."
							/>
						</div>

						{/* Status Filter */}
						<div className="sm:w-48">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Trạng thái
							</label>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All</option>
								<option value="ACTIVE">Active</option>
								<option value="INACTIVE">Inactive</option>
								<option value="EXPIRED">Expired</option>
							</select>
						</div>
					</div>

					{/* Stats Summary */}
					<div className="mt-4 pt-4 border-t border-gray-200">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
							<div className="text-center">
								<div className="text-2xl font-bold text-blue-600">
									{totalElements}
								</div>
								<div className="text-gray-500">Tổng Short URLs</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-green-600">
									{shortUrls.filter((url) => url.status === "ACTIVE").length}
								</div>
								<div className="text-gray-500">Currently Active</div>
							</div>
							<div className="text-center">
								<div className="text-2xl font-bold text-orange-600">
									{shortUrls.reduce((total, url) => total + url.totalClicks, 0)}
								</div>
								<div className="text-gray-500">Tổng clicks</div>
							</div>
						</div>
					</div>
				</div>

				{/* Error Message */}
				{error && (
					<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
						<div className="flex justify-between items-center">
							<p className="text-sm text-red-600">{error}</p>
							<button
								onClick={clearError}
								className="text-red-400 hover:text-red-600"
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
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>
				)}

				{/* Short URL List */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<ShortUrlList
						shortUrls={shortUrls}
						loading={loading}
						onEdit={handleEditShortUrl}
						onDelete={handleDeleteShortUrl}
						onToggleStatus={handleToggleStatus}
						onViewStats={handleViewStats}
					/>

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
									onClick={() =>
										setCurrentPage((prev) => Math.max(0, prev - 1))
									}
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
			</div>

			{/* Create Short URL Modal */}
			{showCreateForm && (
				<div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
						<div className="p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-semibold text-gray-900">
									Create New Short URL
								</h2>
								<button
									onClick={() => {
										setShowCreateForm(false);
										clearError();
									}}
									className="text-gray-400 hover:text-gray-600 transition-colors"
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
								loading={loading}
								error={error}
								onClose={() => {
									setShowCreateForm(false);
									clearError();
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
