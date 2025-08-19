import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { SinglePageDashboard } from "../components/dashboard/SinglePageDashboard";
import { DashboardProvider } from "../contexts/DashboardContext";
import { CreateShortUrlProvider } from "../contexts/CreateShortUrlContext";

function DashboardPage() {
	return (
		<AuthenticatedLayout>
			<DashboardProvider>
				<CreateShortUrlProvider>
					<SinglePageDashboard />
				</CreateShortUrlProvider>
			</DashboardProvider>
		</AuthenticatedLayout>
	);
}

export default DashboardPage;
