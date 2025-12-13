import {useState, useEffect} from 'react';
import {useShortUrl} from '../../hooks/useShortUrl';
import {CreateShortUrlModal} from '../../components/url/CreateShortUrlModal';
import {UpdateShortUrlModal} from '../../components/url/UpdateShortUrlModal';
import {Input, Button} from '../../components/primary';
import type {ShortUrlResponse} from '../../dto/ShortUrlDTO';
import {ShortUrlList} from '../../components/shorturl/ShortUrlList';

export default function LinksPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [currentPage, setCurrentPage] = useState(0);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [selectedShortUrl, setSelectedShortUrl] = useState<ShortUrlResponse | null>(null);
	const [shortUrls, setShortUrls] = useState<ShortUrlResponse[]>([]);
	const [totalElements, setTotalElements] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const {searchShortUrls, deleteShortUrl, enableShortUrl, disableShortUrl, isLoading: loading, refreshSignal} = useShortUrl();

	// Fetch short URLs on component mount and when filters change
	const fetchShortUrls = async (page: number, query?: string, status?: string) => {
		try {
			const response = await searchShortUrls({
				page,
				size: 10,
				query: query || undefined,
				status: status || undefined,
				sortBy: 'createdAt',
				direction: 'desc',
			});
			setShortUrls(response.content);
			setTotalElements(response.totalElements);
			setTotalPages(response.totalPages);
			setError(null);
		} catch (err) {
			console.error('Error fetching short URLs:', err);
			setError('Failed to fetch short URLs');
		}
	};

	useEffect(() => {
		fetchShortUrls(currentPage, searchQuery, statusFilter);
	}, [currentPage, searchQuery, statusFilter, refreshSignal]);

	// Handle search with debounce
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setCurrentPage(0); // Reset to first page when searching
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [searchQuery, statusFilter]);

	const handleSearch = () => {
		setCurrentPage(0);
		fetchShortUrls(0, searchQuery, statusFilter);
	};

	const handleCreateSuccess = () => {
		setShowCreateModal(false);
		// Refresh the list
		fetchShortUrls(currentPage, searchQuery, statusFilter);
	};

	const handleUpdateSuccess = () => {
		setShowUpdateModal(false);
		setSelectedShortUrl(null);
		// Refresh the list
		fetchShortUrls(currentPage, searchQuery, statusFilter);
	};

	const handleEditShortUrl = (shortUrl: ShortUrlResponse) => {
		setSelectedShortUrl(shortUrl);
		setShowUpdateModal(true);
	};

	const handleDeleteShortUrl = async (shortCode: string) => {
		if (window.confirm('Are you sure you want to delete this Short URL?')) {
			try {
				await deleteShortUrl(shortCode);
				// Refresh the list
				fetchShortUrls(currentPage, searchQuery, statusFilter);
			} catch (error) {
				console.error('Error deleting short URL:', error);
				setError('Failed to delete short URL');
			}
		}
	};

	const handleToggleStatus = async (shortCode: string, currentStatus: string) => {
		try {
			const isEnabled = currentStatus === 'ENABLED';
			if (isEnabled) {
				await disableShortUrl(shortCode);
			} else {
				await enableShortUrl(shortCode);
			}
			// Refresh the list
			fetchShortUrls(currentPage, searchQuery, statusFilter);
		} catch (error) {
			console.error('Error toggling short URL status:', error);
			setError('Failed to toggle status');
		}
	};

	const handleViewStats = (shortCode: string) => {
		// TODO: Implement view stats functionality
		console.log('View stats for shortCode:', shortCode);
	};

	const handleClearFilters = () => {
		setSearchQuery('');
		setStatusFilter('');
		setCurrentPage(0);
	};

	const clearError = () => setError(null);

	return (
		<div className="h-full flex flex-col space-y-2 p-2">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between">
					<span>{error}</span>
					<button onClick={clearError} className="text-red-500 hover:text-red-700">
						×
					</button>
				</div>
			)}

			{/* Search, Filters and Create Button in one row */}
			<div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
				<div className="flex flex-col md:flex-row gap-4 items-end">
					<div className="flex-1 md:flex-2">
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
						<Button onClick={handleSearch} variant="primary" className="h-10 px-4">
							Search
						</Button>
						<Button onClick={handleClearFilters} variant="secondary" className="h-10 px-4">
							Clear
						</Button>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex-1 flex flex-col min-h-0">
				<div className="flex-1 overflow-auto">
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
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="pt-4 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
						<div className="text-sm text-gray-500">
							Showing {currentPage * 10 + 1} - {Math.min((currentPage + 1) * 10, totalElements)} of{' '}
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
								{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
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
													? 'bg-blue-600 text-white'
													: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
								onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
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
				{selectedShortUrl && (
					<UpdateShortUrlModal
						open={showUpdateModal}
						onClose={() => {
							setShowUpdateModal(false);
							setSelectedShortUrl(null);
						}}
						onSuccess={handleUpdateSuccess}
						shortUrl={selectedShortUrl}
					/>
				)}
			</div>
		</div>
	);
}
