import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import DashboardPage from "./pages/DashboardPage";
import UnlockUrlPage from "./pages/UnlockUrlPage";
import RedirectPage from "./pages/RedirectPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RegisterSuccessPage } from "./pages/RegisterSuccessPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

function App() {
	return (
		<>
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

				{/* Unlock URL route - Public route for password-protected links */}
				<Route path="/:shortCode/unlock" element={<UnlockUrlPage />} />

				{/* Short URL redirect route - Public route for direct access */}
				<Route path="/:shortCode" element={<RedirectPage />} />

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
			</Routes>
		</>
	);
}

export default App;
