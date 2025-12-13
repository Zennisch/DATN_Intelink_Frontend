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

	// State for copy feedback
	const [copiedId, setCopiedId] = useState<number | null>(null);

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

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (openMenuId !== null && !(event.target as Element).closest('.action-menu-container')) {
				setOpenMenuId(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [openMenuId]);

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

	const handleCopy = (text: string, id: number) => {
		navigator.clipboard.writeText(text);
		setCopiedId(id);
		setTimeout(() => setCopiedId(null), 2000);
	};

	const getSafetyStatus = (url: ShortUrlResponse): {status: ShortUrlAnalysisStatus; label: string; color: string; icon: string; ring: string} => {
		if (!url.analysisResults || url.analysisResults.length === 0) {
			return {status: 'SAFE', label: 'Safe', color: 'bg-emerald-50 text-emerald-700', icon: 'fa-check-circle', ring: 'ring-emerald-600/20'};
		}

		const latestResult = url.analysisResults[0];
		// Enhanced color palette for better visual hierarchy
		const statusMap: Record<ShortUrlAnalysisStatus, {label: string; color: string; icon: string; ring: string}> = {
			SAFE: {label: 'Safe', color: 'bg-emerald-50 text-emerald-700', icon: 'fa-check-circle', ring: 'ring-emerald-600/20'},
			PENDING: {label: 'Scanning', color: 'bg-blue-50 text-blue-700', icon: 'fa-spinner fa-spin', ring: 'ring-blue-600/20'},
			MALWARE: {label: 'Malware', color: 'bg-rose-50 text-rose-700', icon: 'fa-bug', ring: 'ring-rose-600/20'},
			SOCIAL_ENGINEERING: {label: 'Phishing', color: 'bg-orange-50 text-orange-700', icon: 'fa-user-secret', ring: 'ring-orange-600/20'},
			MALICIOUS: {label: 'Malicious', color: 'bg-red-50 text-red-700', icon: 'fa-radiation', ring: 'ring-red-600/20'},
			SUSPICIOUS: {label: 'Suspicious', color: 'bg-amber-50 text-amber-700', icon: 'fa-exclamation-triangle', ring: 'ring-amber-600/20'},
			UNKNOWN: {label: 'Unknown', color: 'bg-slate-50 text-slate-700', icon: 'fa-question-circle', ring: 'ring-slate-600/20'},
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
		});
	};

	return (
		<div className="h-screen bg-slate-50 flex flex-col font-sans">
			{/* Decorative background accent */}
			<div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50 to-slate-50 pointer-events-none" />

			<div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 sm:p-8 z-0 overflow-hidden relative">
				{/* Header Section */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 flex-shrink-0 gap-4">
					<div className="flex items-baseline gap-4">
						<h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Links</h1>
						<p className="text-slate-500 text-sm sm:text-base">Manage, track, and secure your shortened URLs.</p>
					</div>
				</div>

				{/* Search and Filters Toolbar */}
				<div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex-shrink-0 sticky top-0 z-10">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
						<div className="md:col-span-6 relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<i className="fas fa-search text-slate-400"></i>
							</div>
							<Input
								placeholder="Search by title, URL, or short code..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
								fullWidth
								className="pl-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
							/>
						</div>

						<div className="md:col-span-3">
							<Select
								placeholder="Filter Status"
								value={statusFilter}
								onChange={(value) => setStatusFilter(value)}
								fullWidth
								options={[
									{value: '', label: 'All Status'},
									{value: 'enabled', label: 'Active'},
									{value: 'disabled', label: 'Disabled'},
								]}
							/>
						</div>

						<div className="md:col-span-3">
							<Select
								placeholder="Sort Order"
								value={sortBy}
								onChange={(value) => setSortBy(value)}
								fullWidth
								options={[
									{value: 'createdAt', label: 'Newest First'},
									{value: 'totalClicks', label: 'Most Clicks'},
									{value: 'title', label: 'Alphabetical'},
								]}
							/>
						</div>
					</div>
				</div>

				{/* Content Area */}
				<div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-10 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
					{isLoading ? (
						<div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-pulse">
							<i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-indigo-500"></i>
							<p>Loading your links...</p>
						</div>
					) : urls.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-96 bg-white border border-dashed border-slate-300 rounded-2xl">
							<div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
								<i className="fas fa-link text-3xl text-indigo-400"></i>
							</div>
							<h3 className="text-xl font-bold text-slate-900 mb-2">No links found</h3>
							<p className="text-slate-500 max-w-sm text-center mb-6">
								{searchQuery ? "We couldn't find any links matching your search." : "Get started by creating your first shortened URL."}
							</p>
							{searchQuery && (
								<Button variant="outline" onClick={() => {setSearchQuery(''); handleSearch();}}>
									Clear Search
								</Button>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{urls.map((url) => {
								const safety = getSafetyStatus(url);
								const hasThreat = url.analysisResults && url.analysisResults.length > 0 && safety.status !== 'SAFE';
								const isCopied = copiedId === url.id;

								return (
									<div 
										key={url.id} 
										className={`group bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col ${!url.enabled ? 'opacity-75 bg-slate-50' : ''}`}
									>
										<div className="p-5 flex-1">
											<div className="flex items-start justify-between mb-4">
												{/* Header: Icon + Title */}
												<div className="flex items-start gap-3 min-w-0 flex-1">
													<div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg ${url.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
														<i className="fas fa-globe"></i>
													</div>
													<div className="min-w-0">
														<div className="flex items-center gap-2">
															<h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
																{url.title || 'Untitled Link'}
															</h3>
															{/* Safety Badge */}
															<div 
																className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border border-transparent ${safety.color} ${safety.ring} ring-1 cursor-help transition-colors`}
																data-tooltip-id={`safety-${url.id}`}
																data-tooltip-content={
																	hasThreat
																		? `Threat Type: ${url.analysisResults![0].threatType}\nEngine: ${url.analysisResults![0].engine}\nDetails: ${url.analysisResults![0].details || 'No details'}`
																		: 'This URL is considered safe by our scanning engines.'
																}
															>
																<i className={`fas ${safety.icon}`}></i>
																{safety.label}
															</div>
															{hasThreat && (
																<Tooltip id={`safety-${url.id}`} place="top" style={{whiteSpace: 'pre-line', zIndex: 50}} />
															)}
														</div>
														<p className="text-xs text-slate-400 mt-0.5">
															Created {formatDate(url.createdAt)}
														</p>
													</div>
												</div>

												{/* Action Menu */}
												<div className="relative action-menu-container ml-2">
													<button
														onClick={() => setOpenMenuId(openMenuId === url.id ? null : url.id)}
														className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${openMenuId === url.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
													>
														<i className="fas fa-ellipsis-v"></i>
													</button>

													{openMenuId === url.id && (
														<div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden ring-1 ring-black/5 animate-fade-in-down">
															<div className="py-1">
																<button
																	onClick={() => {
																		setOpenMenuId(null);
																		// Add edit logic
																	}}
																	className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
																>
																	<i className="fas fa-pen text-slate-400 w-4"></i> Edit Details
																</button>
																<button
																	onClick={() => {
																		if (url.enabled) handleDisable(url.shortCode);
																		else handleEnable(url.shortCode);
																		setOpenMenuId(null);
																	}}
																	className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
																>
																	<i className={`fas ${url.enabled ? 'fa-ban' : 'fa-power-off'} text-slate-400 w-4`}></i>
																	{url.enabled ? 'Disable Link' : 'Enable Link'}
																</button>
																<div className="border-t border-slate-100 my-1"></div>
																<button
																	onClick={() => {
																		handleDelete(url.shortCode);
																		setOpenMenuId(null);
																	}}
																	className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
																>
																	<i className="fas fa-trash-alt w-4"></i> Delete
																</button>
															</div>
														</div>
													)}
												</div>
											</div>

											{/* Main Link Area */}
											<div className="mb-4 bg-slate-50/50 rounded-lg p-3 border border-slate-100">
												<div className="flex items-center justify-between gap-3 mb-1">
													<a
														href={url.shortUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-indigo-600 hover:text-indigo-700 font-bold text-lg truncate hover:underline underline-offset-2"
													>
														{url.shortUrl.replace(/^https?:\/\//, '')}
													</a>
													<button
														onClick={() => handleCopy(url.shortUrl, url.id)}
														className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'}`}
													>
														<i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
														{isCopied ? 'Copied!' : 'Copy'}
													</button>
												</div>
												<div className="flex items-center gap-2 text-xs text-slate-500 truncate">
													<i className="fas fa-turn-up fa-flip-horizontal text-slate-300"></i>
													<span className="truncate" title={url.originalUrl}>{url.originalUrl}</span>
												</div>
											</div>

											{/* Tags/Badges */}
											<div className="flex flex-wrap items-center gap-2">
												{/* Status Badge */}
												{!url.enabled && (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-500/10 border border-transparent">
														<i className="fas fa-ban"></i> Disabled
													</span>
												)}
											</div>
										</div>

										{/* Stats Footer */}
										<div className="bg-slate-50/80 border-t border-slate-100 p-4 rounded-b-xl">
											<div className="grid grid-cols-3 gap-2 text-sm">
												<div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all">
													<span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Clicks</span>
													<span className="font-bold text-slate-800 flex items-center gap-1.5">
														<i className="fas fa-mouse-pointer text-indigo-400 text-xs"></i>
														{url.totalClicks.toLocaleString()}
													</span>
												</div>
												<div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border-l border-r border-slate-200/50">
													<span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Allowed</span>
													<span className="font-bold text-emerald-600 flex items-center gap-1.5">
														<i className="fas fa-check text-emerald-400 text-xs"></i>
														{url.allowedClicks.toLocaleString()}
													</span>
												</div>
												<div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all">
													<span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Blocked</span>
													<span className="font-bold text-rose-600 flex items-center gap-1.5">
														<i className="fas fa-shield-alt text-rose-400 text-xs"></i>
														{url.blockedClicks.toLocaleString()}
													</span>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-4 flex-shrink-0 flex items-center justify-between border-t border-slate-200 pt-4 bg-slate-50">
						<div className="text-sm text-slate-500">
							Showing <span className="font-medium text-slate-900">{page * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min((page + 1) * 10, totalElements)}</span> of <span className="font-medium text-slate-900">{totalElements}</span> results
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.max(0, page - 1))}
								disabled={page === 0}
								className="border-slate-300 text-slate-600"
							>
								Previous
							</Button>
							<div className="hidden sm:flex items-center gap-1">
								{Array.from({length: Math.min(5, totalPages)}, (_, i) => {
									const pageNum = i + Math.max(0, Math.min(page - 2, totalPages - 5));
									if (pageNum < 0 || pageNum >= totalPages) return null;
									return (
										<button
											key={pageNum}
											onClick={() => setPage(pageNum)}
											className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
												page === pageNum
													? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
													: 'text-slate-600 hover:bg-white hover:text-indigo-600'
											}`}
										>
											{pageNum + 1}
										</button>
									);
								})}
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
								disabled={page === totalPages - 1}
								className="border-slate-300 text-slate-600"
							>
								Next
							</Button>
						</div>
					</div>
				)}
			</div>

			<Modal
				open={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Confirm Deletion"
				size="sm"
				footer={
					<div className="flex gap-3 justify-end w-full">
						<Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-lg shadow-red-100"
						>
							Delete URL
						</Button>
					</div>
				}
			>
				<div className="flex items-start gap-4">
					<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
						<i className="fas fa-exclamation-triangle text-red-600"></i>
					</div>
					<div>
						<h4 className="text-slate-900 font-medium mb-1">Are you absolutely sure?</h4>
						<p className="text-slate-500 text-sm leading-relaxed">
							This action cannot be undone. This will permanently delete the short URL and all associated analytics data.
						</p>
					</div>
				</div>
			</Modal>
		</div>
	);
}