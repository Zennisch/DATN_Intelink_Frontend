import { Routes, Route } from "react-router-dom";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { dashboardRoutes } from "./dashboard/routes";

function DashboardPage() {
	return (
		<AuthenticatedLayout>
			<Routes>
				{dashboardRoutes.map((route, index) => (
					<Route key={index} path={route.path} element={route.component} />
				))}
			</Routes>
		</AuthenticatedLayout>
	);
}

export default DashboardPage;
