import "@fortawesome/fontawesome-free/css/all.min.css";
import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {BrowserRouter} from 'react-router-dom';
import {AuthProvider} from './hooks/useAuth.tsx';
import {ShortUrlProvider} from './hooks/useShortUrl.tsx';
import {StatisticsProvider} from './hooks/useStatistics.tsx';
import {SubscriptionProvider} from './hooks/useSubscription.tsx';
import {PaymentProvider} from './hooks/usePayment.tsx';
import PageSpinner from './components/layout/PageSpinner.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ShortUrlProvider>
					<StatisticsProvider>
						<SubscriptionProvider>
							<PaymentProvider>
								<Suspense fallback={<PageSpinner />}>
									<App />
								</Suspense>
							</PaymentProvider>
						</SubscriptionProvider>
					</StatisticsProvider>
				</ShortUrlProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
);
