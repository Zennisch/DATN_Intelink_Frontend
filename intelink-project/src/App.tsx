import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";

function App() {
	return (
		<Routes>
			{/* Public routes */}
			<Route path="/login" element={<LoginPage />} />
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
			<Route path="/" element={<LoginPage />} />
			{/* <Route path="*" element={<NotFoundPage />} /> */}
		</Routes>
	);
}

export default App;
