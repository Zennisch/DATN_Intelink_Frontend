import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ShortUrlProvider } from "./contexts/ShortUrlContext.tsx";
import { setupAxios } from "./services/AxiosConfig.ts";

localStorage.setItem("ACCESS_TOKEN", import.meta.env.VITE_TEST_ACCESS_TOKEN);
localStorage.setItem("REFRESH_TOKEN", import.meta.env.VITE_TEST_REFRESH_TOKEN);

setupAxios();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ShortUrlProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ShortUrlProvider>
	</StrictMode>,
);
