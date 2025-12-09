import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './hooks/useAuth.tsx';
import PageSpinner from './components/layout/PageSpinner.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Suspense fallback={<PageSpinner />}>
					<App />
				</Suspense>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
