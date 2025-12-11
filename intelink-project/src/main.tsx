import "@fortawesome/fontawesome-free/css/all.min.css";
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import "./index.css";
import { ShortUrlProvider } from "./contexts/ShortUrlContext.tsx";
import { setupAxios } from "./services/AxiosConfig.ts";

setupAxios().then();

const App = lazy(() => import("./App.tsx"));

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<ShortUrlProvider>
					<Suspense>
						<App />
					</Suspense>
				</ShortUrlProvider>
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
