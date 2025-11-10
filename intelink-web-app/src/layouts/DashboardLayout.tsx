import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMain } from "./DashboardMain";
import { CreateShortUrlModal } from "../components/url/CreateShortUrlModalNew";

interface DashboardLayoutProps {}

export type Page = "overview" | "links" | "statistics" | "apis" | "domains";

export const DashboardLayout = ({}: DashboardLayoutProps) => {
	const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState<Page>("overview");

	return (
		<div className="flex flex-row min-h-screen">
			<DashboardSidebar
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				setCreateNewModalOpen={setCreateNewModalOpen}
			/>
			<DashboardMain currentPage={currentPage} />
			<CreateShortUrlModal
				open={createNewModalOpen}
				onClose={() => setCreateNewModalOpen(false)}
			/>
		</div>
	);
};
