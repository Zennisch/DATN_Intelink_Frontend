import "@fortawesome/fontawesome-free/css/all.min.css";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PageSpinner } from "./legacy/components/ui/Spinner.tsx";
import { AuthProvider } from "./legacy/contexts/AuthContext.tsx";
import "./index.css";
import { ShortUrlProvider } from "./legacy/contexts/ShortUrlContext.tsx";
import { setupAxios } from "./legacy/services/AxiosConfig.ts";

setupAxios();

const App = lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
	<Suspense fallback={<PageSpinner />}>
		<StrictMode>
			<BrowserRouter>
				<AuthProvider>
					<ShortUrlProvider>
						<App />
					</ShortUrlProvider>
				</AuthProvider>
			</BrowserRouter>
		</StrictMode>
	</Suspense>,
);
