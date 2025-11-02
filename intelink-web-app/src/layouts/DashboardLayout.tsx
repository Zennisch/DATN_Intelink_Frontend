import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMain } from "./DashboardMain";
import { ModalExamples } from "../components/primary/Modal.examples";

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
			{createNewModalOpen && (
				<ModalExamples />
			)}
		</div>
	);
};
