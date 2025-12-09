import {useState} from 'react';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { DashboardMain } from '../components/layout/DashboardContent';

export type Page = 'overview' | 'links' | 'statistics' | 'apis' | 'domains';

interface DashboardPageProps {}

export default function({}: DashboardPageProps) {
	const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<Page>('overview');

	return <div className="flex flex-row min-h-screen">
    <DashboardSidebar
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      setCreateNewModalOpen={setCreateNewModalOpen}
    />
    <DashboardMain
      currentPage={currentPage}
    />
  </div>;
};
