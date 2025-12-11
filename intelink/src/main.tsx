import "@fortawesome/fontawesome-free/css/all.min.css";
import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './hooks/useAuth.tsx';
import {ShortUrlProvider} from './hooks/useShortUrl.tsx';
import PageSpinner from './components/layout/PageSpinner.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ShortUrlProvider>
					<Suspense fallback={<PageSpinner />}>
						<App />
					</Suspense>
				</ShortUrlProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
