import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardMain } from "./DashboardMain";

interface DashboardLayoutProps {}

export type Page = "overview" | "links" | "statistics" | "apis" | "domains";

export const DashboardLayout = ({}: DashboardLayoutProps) => {
	const [currentPage, setCurrentPage] = useState<Page>("overview");

	return (
		<div className="flex flex-row min-h-screen">
			<DashboardSidebar
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<DashboardMain currentPage={currentPage} />
		</div>
	);
};
