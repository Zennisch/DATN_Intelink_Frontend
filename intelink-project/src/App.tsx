import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import DashboardPage from "./pages/DashboardPage";
import { AxiosNavigationSetup } from "./components/AxiosNavigationSetup";
import StatisticsPage from "./pages/StatisticsPage";

function App() {
	return (
		<>
			<AxiosNavigationSetup />
			<Routes>
				{/* Public routes - redirect to dashboard if already authenticated */}
				<Route 
					path="/login" 
					element={
						<AuthenticatedRoute>
							<LoginPage />
						</AuthenticatedRoute>
					} 
				/>
				{/* <Route path="/register" element={<RegisterPage />} /> */}
					
				{/* Protected routes */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>

				{/* Default redirect */}
				<Route 
					path="/" 
					element={
						<AuthenticatedRoute>
							<LoginPage />
						</AuthenticatedRoute>
					} 
				/>
				{/* <Route path="*" element={<NotFoundPage />} /> */}

				<Route
					path="/statistics"
					element={
						<ProtectedRoute>
							<StatisticsPage />
						</ProtectedRoute>
					}
				/>

			</Routes>
		</>
	);
}

export default App;
