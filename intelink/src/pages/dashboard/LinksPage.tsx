import {useState, useEffect} from 'react';
import {useShortUrl} from '../../hooks/useShortUrl';
import {Button, Input, Select, Modal} from '../../components/primary';
import type {ShortUrlResponse, ShortUrlAnalysisStatus} from '../../dto/ShortUrlDTO';
import {Tooltip} from 'react-tooltip';

export default function LinksPage() {
	const {getShortUrls, searchShortUrls, enableShortUrl, disableShortUrl, deleteShortUrl, isLoading, refreshSignal} = useShortUrl();

	const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [sortBy, setSortBy] = useState('createdAt');
	const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [openMenuId, setOpenMenuId] = useState<number | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

	const fetchUrls = async () => {
		try {
			const response = await searchShortUrls({
				query: searchQuery || undefined,
				status: statusFilter || undefined,
				sortBy,
				direction,
				page,
				size: 10,
			});
			setUrls(response.content);
			setTotalPages(response.totalPages);
			setTotalElements(response.totalElements);
		} catch (error) {
			console.error('Failed to fetch URLs:', error);
		}
	};

	useEffect(() => {
		fetchUrls();
	}, [page, sortBy, direction, statusFilter, refreshSignal]);

	const handleSearch = () => {
		setPage(0);
		fetchUrls();
	};

	const handleEnable = async (shortCode: string) => {
		try {
			await enableShortUrl(shortCode);
			fetchUrls();
		} catch (error) {
			console.error('Failed to enable URL:', error);
		}
	};

	const handleDisable = async (shortCode: string) => {
		try {
			await disableShortUrl(shortCode);
			fetchUrls();
		} catch (error) {
			console.error('Failed to disable URL:', error);
		}
	};

	const handleDelete = (shortCode: string) => {
		setUrlToDelete(shortCode);
		setDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		if (urlToDelete) {
			try {
				await deleteShortUrl(urlToDelete);
				fetchUrls();
				setDeleteModalOpen(false);
				setUrlToDelete(null);
			} catch (error) {
				console.error('Failed to delete URL:', error);
			}
		}
	};

	const getSafetyStatus = (url: ShortUrlResponse): {status: ShortUrlAnalysisStatus; label: string; color: string} => {
		if (!url.analysisResults || url.analysisResults.length === 0) {
			return {status: 'SAFE', label: 'Safe', color: 'bg-green-100 text-green-800'};
		}

		const latestResult = url.analysisResults[0];
		const statusMap: Record<ShortUrlAnalysisStatus, {label: string; color: string}> = {
			SAFE: {label: 'Safe', color: 'bg-green-100 text-green-800'},
			PENDING: {label: 'Scanning', color: 'bg-yellow-100 text-yellow-800'},
			MALWARE: {label: 'Malware', color: 'bg-red-100 text-red-800'},
			SOCIAL_ENGINEERING: {label: 'Phishing', color: 'bg-red-100 text-red-800'},
			MALICIOUS: {label: 'Malicious', color: 'bg-red-100 text-red-800'},
			SUSPICIOUS: {label: 'Suspicious', color: 'bg-orange-100 text-orange-800'},
			UNKNOWN: {label: 'Unknown', color: 'bg-gray-100 text-gray-800'},
		};

		return {
			status: latestResult.status,
			...statusMap[latestResult.status],
		};
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="h-screen bg-gray-50 flex flex-col">
			<div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 overflow-hidden">
				{/* Header */}
				<div className="mb-8 flex-shrink-0">
					<h1 className="text-3xl font-bold text-gray-900">My Links</h1>
					<p className="text-gray-600 mt-2">Manage and monitor your shortened URLs</p>
				</div>

				{/* Search and Filters */}
				<div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex-shrink-0">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="md:col-span-2">
							<Input
								placeholder="Search by title, URL, or short code..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								fullWidth
								endAdornment={
									<button onClick={handleSearch} className="text-gray-400 hover:text-gray-600">
										<i className="fas fa-search"></i>
									</button>
								}
							/>
						</div>

						<Select
							placeholder="Status"
							value={statusFilter}
							onChange={(value) => setStatusFilter(value)}
							fullWidth
							options={[
								{value: '', label: 'All Status'},
								{value: 'enabled', label: 'Enabled'},
								{value: 'disabled', label: 'Disabled'},
							]}
						/>

						<Select
							placeholder="Sort by"
							value={sortBy}
							onChange={(value) => setSortBy(value)}
							fullWidth
							options={[
								{value: 'createdAt', label: 'Created Date'},
								{value: 'totalClicks', label: 'Total Clicks'},
								{value: 'title', label: 'Title'},
							]}
						/>
					</div>
				</div>

				{/* URL List */}
				<div className="flex-1 overflow-y-auto min-h-0 pr-2">
					<div className={!isLoading && urls.length > 0 ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : 'space-y-4'}>
						{isLoading ? (
						<div className="flex items-center justify-center py-12">
							<i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
						</div>
					) : urls.length === 0 ? (
						<div className="bg-white rounded-lg shadow-sm p-12 text-center">
							<i className="fas fa-link text-6xl text-gray-300 mb-4"></i>
							<h3 className="text-xl font-semibold text-gray-900 mb-2">No URLs found</h3>
							<p className="text-gray-600">Create your first short URL to get started</p>
						</div>
					) : (
						urls.map((url) => {
							const safety = getSafetyStatus(url);
							const hasThreat = url.analysisResults && url.analysisResults.length > 0 && safety.status !== 'SAFE';

							return (
								<div key={url.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											{/* Title and Short URL */}
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-lg font-semibold text-gray-900 truncate">
													{url.title || 'Untitled'}
												</h3>
												<span
													className={`px-2 py-1 text-xs font-medium rounded-full ${safety.color}`}
													data-tooltip-id={`safety-${url.id}`}
													data-tooltip-content={
														hasThreat
															? `Threat Type: ${url.analysisResults![0].threatType}\nEngine: ${url.analysisResults![0].engine}\nDetails: ${url.analysisResults![0].details || 'No details'}`
															: 'This URL is safe'
													}
												>
													{safety.status === 'SAFE' ? (
														<i className="fas fa-check-circle mr-1"></i>
													) : (
														<i className="fas fa-exclamation-triangle mr-1"></i>
													)}
													{safety.label}
												</span>
												{hasThreat && (
													<Tooltip id={`safety-${url.id}`} place="top" style={{whiteSpace: 'pre-line'}} />
												)}
												{!url.enabled && (
													<span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
														<i className="fas fa-ban mr-1"></i>
														Disabled
													</span>
												)}
											</div>

											{/* Short URL */}
											<div className="flex items-center gap-2 mb-2">
												<a
													href={url.shortUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
												>
													{url.shortUrl}
												</a>
												<button
													onClick={() => {
														navigator.clipboard.writeText(url.shortUrl);
													}}
													className="text-gray-400 hover:text-gray-600 text-xs"
												>
													<i className="fas fa-copy"></i>
												</button>
											</div>

											{/* Original URL */}
											<p className="text-sm text-gray-600 truncate mb-3">{url.originalUrl}</p>

											{/* Stats */}
											<div className="flex items-center gap-6 text-sm text-gray-500">
												<span>
													<i className="fas fa-mouse-pointer mr-1"></i>
													{url.totalClicks} clicks
												</span>
												<span>
													<i className="fas fa-check-circle mr-1 text-green-500"></i>
													{url.allowedClicks} allowed
												</span>
												<span>
													<i className="fas fa-ban mr-1 text-red-500"></i>
													{url.blockedClicks} blocked
												</span>
												<span>
													<i className="fas fa-calendar mr-1"></i>
													{formatDate(url.createdAt)}
												</span>
											</div>
										</div>

										{/* Actions Menu */}
										<div className="relative ml-4">
											<button
												onClick={() => setOpenMenuId(openMenuId === url.id ? null : url.id)}
												className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
											>
												<i className="fas fa-ellipsis-v"></i>
											</button>

											{openMenuId === url.id && (
												<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
													<button
														onClick={() => {
															// TODO: Open edit modal
															setOpenMenuId(null);
														}}
														className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
													>
														<i className="fas fa-edit"></i>
														Edit
													</button>
													<button
														onClick={() => {
															if (url.enabled) {
																handleDisable(url.shortCode);
															} else {
																handleEnable(url.shortCode);
															}
															setOpenMenuId(null);
														}}
														className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
													>
														<i className={`fas ${url.enabled ? 'fa-ban' : 'fa-check-circle'}`}></i>
														{url.enabled ? 'Disable' : 'Enable'}
													</button>
													<button
														onClick={() => {
															handleDelete(url.shortCode);
															setOpenMenuId(null);
														}}
														className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100"
													>
														<i className="fas fa-trash"></i>
														Delete
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})
					)}
					</div>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-6 flex-shrink-0 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
						<div className="text-sm text-gray-600">
							Showing {page * 10 + 1} to {Math.min((page + 1) * 10, totalElements)} of {totalElements} results
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.max(0, page - 1))}
								disabled={page === 0}
							>
								<i className="fas fa-chevron-left"></i>
							</Button>
							{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
								const pageNum = i + Math.max(0, page - 2);
								if (pageNum >= totalPages) return null;
								return (
									<Button
										key={pageNum}
										variant={page === pageNum ? 'primary' : 'outline'}
										size="sm"
										onClick={() => setPage(pageNum)}
									>
										{pageNum + 1}
									</Button>
								);
							})}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
								disabled={page === totalPages - 1}
							>
								<i className="fas fa-chevron-right"></i>
							</Button>
						</div>
					</div>
				)}
			</div>

			<Modal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Delete URL"
				size="sm"
				footer={
					<>
						<Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700 border-red-600"
						>
							Delete
						</Button>
					</>
				}
			>
				<p className="text-gray-600">Are you sure you want to delete this URL? This action cannot be undone.</p>
			</Modal>
		</div>
	);
}