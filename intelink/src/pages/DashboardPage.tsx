import {useState} from 'react';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardMain } from '../components/layout/DashboardContent';
import { CreateShortUrlModal } from '../components/url';

export type Page = 'overview' | 'links' | 'statistics' | 'apis' | 'subscriptions';

interface DashboardPageProps {}

export default function({}: DashboardPageProps) {
	const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<Page>('overview');

	const handleCreateSuccess = () => {
		// Optionally navigate to links page after creating
		if (currentPage !== 'links') {
			setCurrentPage('links');
		}
		// Force refresh of links page will be handled by LinksPage's useEffect
	};

	return (
		<>
			<div className="flex flex-row min-h-screen">
				<DashboardSidebar
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					setCreateNewModalOpen={setCreateNewModalOpen}
				/>
				<DashboardMain
					currentPage={currentPage}
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
