import { useEffect } from "react";
import "./App.css";
import { DashboardLayout } from "./layouts/DashboardLayout";

function App() {
	useEffect(() => {
		const preloader = document.getElementById("preloader");
		if (preloader) {
			preloader.style.opacity = "0";
			setTimeout(() => {
				if (preloader.parentNode) {
					preloader.parentNode.removeChild(preloader);
				}
			}, 1000);
		}
		setTimeout(() => {
			if (typeof window.clear === "function") {
				window.clear();
			}
		}, 1000);
	}, []);

	return <DashboardLayout />;
}

export default App;
