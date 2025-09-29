import "@fortawesome/fontawesome-free/css/all.min.css";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./legacy/contexts/AuthContext.tsx";
import "./index.css";
import { ShortUrlProvider } from "./legacy/contexts/ShortUrlContext.tsx";
import { setupAxios } from "./legacy/services/AxiosConfig.ts";
import { LoadingPage } from "./current/components/ui";

setupAxios().then();

const App = lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ShortUrlProvider>
					<Suspense fallback={<LoadingPage />}>
						<App />
					</Suspense>
				</ShortUrlProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
