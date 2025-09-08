import "@fortawesome/fontawesome-free/css/all.min.css";
import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PageSpinner } from "./components/ui/Spinner.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { AxiosNavigationProvider } from "./contexts/AxiosNavigationContext.tsx";
import "./index.css";
import { setupAxios } from "./services/AxiosConfig.ts";

const App = lazy(() => import("./App.tsx"));

setupAxios();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AxiosNavigationProvider>
				<AuthProvider>
					<Suspense fallback={<PageSpinner />}>
						<App />
					</Suspense>
				</AuthProvider>
			</AxiosNavigationProvider>
		</BrowserRouter>
	</StrictMode>,
);
