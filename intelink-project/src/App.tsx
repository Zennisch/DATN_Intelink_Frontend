import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import RouteGuard from "./components/RouteGuard";
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
						<RouteGuard>
							<LoginPage />
						</RouteGuard>
					}
				/>

				<Route path="/auth/oauth2/callback" element={<OAuth2CallbackPage />} />

				<Route
					path="/register"
					element={
						<RouteGuard>
							<RegisterPage />
						</RouteGuard>
					}
				/>

				<Route path="/register/success" element={<RegisterSuccessPage />} />

				<Route path="/verify-email" element={<VerifyEmailPage />} />

				<Route
					path="/forgot-password"
					element={
						<RouteGuard>
							<ForgotPasswordPage />
						</RouteGuard>
					}
				/>

				<Route path="/reset-password" element={<ResetPasswordPage />} />

				<Route path="/:shortCode/unlock" element={<UnlockUrlPage />} />

				<Route path="/:shortCode" element={<RedirectPage />} />

				<Route
					path="/dashboard"
					element={
						<RouteGuard requireAuth>
							<DashboardPage />
						</RouteGuard>
					}
				/>

				<Route
					path="/"
					element={
						<RouteGuard>
							<LoginPage />
						</RouteGuard>
					}
				/>
				{/* <Route path="*" element={<NotFoundPage />} /> */}
			</Routes>
		</>
	);
}

export default App;
