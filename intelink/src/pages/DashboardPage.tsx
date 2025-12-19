import {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardMain } from '../components/layout/DashboardContent';
import { CreateShortUrlModal } from '../components/url';

export type Page = 'overview' | 'links' | 'dashboard' | 'statistics' | 'apis' | 'subscriptions';

interface DashboardPageProps {}

export default function({}: DashboardPageProps) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
	
	const tabParam = searchParams.get('tab') as Page;
	const initialPage: Page = (tabParam && ['overview', 'links', 'dashboard', 'statistics', 'apis', 'subscriptions'].includes(tabParam)) 
		? tabParam 
		: 'overview';

	const [currentPage, setCurrentPageState] = useState<Page>(initialPage);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	// Sync state with URL param if it changes externally (e.g. back button)
	useEffect(() => {
		const tab = searchParams.get('tab') as Page;
		const validTabs = ['overview', 'links', 'dashboard', 'statistics', 'apis', 'subscriptions'];
		
		if (tab && validTabs.includes(tab)) {
			if (tab !== currentPage) {
				setCurrentPageState(tab);
			}
		} else if (!tab && currentPage !== 'overview') {
			setCurrentPageState('overview');
		}
	}, [searchParams, currentPage]);

	const setCurrentPage = (page: Page) => {
		setCurrentPageState(page);
		setSearchParams({ tab: page });
		setIsMobileSidebarOpen(false);
	};

	const handleCreateSuccess = () => {
		// Optionally navigate to links page after creating
		if (currentPage !== 'links') {
			setCurrentPage('links');
		}
		// Force refresh of links page will be handled by LinksPage's useEffect
	};

	return (
		<>
			<div className="flex flex-row min-h-screen relative">
				<DashboardSidebar
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setCreateNewModalOpen={setCreateNewModalOpen}
					isMobileOpen={isMobileSidebarOpen}
					onMobileClose={() => setIsMobileSidebarOpen(false)}
				/>
				<DashboardMain
					currentPage={currentPage}
					onOpenSidebar={() => setIsMobileSidebarOpen(true)}
				/>
			</div>
			
			<CreateShortUrlModal
				open={createNewModalOpen}
				onClose={() => setCreateNewModalOpen(false)}
				onSuccess={handleCreateSuccess}
			/>
		</>
	);
};
