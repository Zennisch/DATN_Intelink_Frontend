import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { useEffect } from "react";

declare global {
	interface Window {
		clear?: () => void;
	}
}

function App() {
	useEffect(() => {
		const preloader = document.getElementById("preloader");
		if (preloader) {
			preloader.style.opacity = "0";
			setTimeout(() => {
				if (preloader.parentNode) {
					preloader.parentNode.removeChild(preloader);
				}
			}, 300);
		}
		setTimeout(() => {
			if (typeof window.clear === "function") {
				window.clear();
			}
		}, 1000);
	}, []);

	return (
		<Routes>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} element={route.element} />
			))}
		</Routes>
	);
}

export default App;
