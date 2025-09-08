import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { SinglePageDashboard } from "../components/dashboard/SinglePageDashboard";
import { DashboardProvider } from "../contexts/DashboardContext";

function DashboardPage() {
	return (
		<AuthenticatedLayout>
			<DashboardProvider>
					<SinglePageDashboard />
			</DashboardProvider>
		</AuthenticatedLayout>
	);
}

export default DashboardPage;
