import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />}></Route>

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* <Route path="*" element={<NotFoundPage />} /> */}
		</Routes>
	);
}

export default App;
