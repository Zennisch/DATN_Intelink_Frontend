import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import DashboardPage from "./pages/DashboardPage";
import { AxiosNavigationSetup } from "./components/AxiosNavigationSetup";
import StatisticsPage from "./pages/StatisticsPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RegisterSuccessPage } from "./pages/RegisterSuccessPage";

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

				<Route path="/auth/oauth2/callback" element={<OAuth2CallbackPage />} />
				
				<Route
					path="/register"
					element={
						<AuthenticatedRoute>
							<RegisterPage />
						</AuthenticatedRoute>
					}
				/>
				
				<Route 
					path="/register/success" 
					element={<RegisterSuccessPage />} 
				/>

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
