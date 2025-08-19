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
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ShortUrlPage } from "./pages/ShortUrlPage";

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

				<Route path="/register/success" element={<RegisterSuccessPage />} />

				<Route path="/verify-email" element={<VerifyEmailPage />} />

				<Route
					path="/forgot-password"
					element={
						<AuthenticatedRoute>
							<ForgotPasswordPage />
						</AuthenticatedRoute>
					}
				/>

				<Route path="/reset-password" element={<ResetPasswordPage />} />

				{/* Protected routes */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/short-urls"
					element={
						<ProtectedRoute>
							<ShortUrlPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/statistics"
					element={
						<ProtectedRoute>
							<StatisticsPage />
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
			</Routes>
		</>
	);
}

export default App;
