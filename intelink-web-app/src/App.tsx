import { useEffect } from "react";
import "./App.css";

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

	return (
		<>
			<h1 className="text-3xl font-bold underline">Hello world!</h1>
			<i className="fa fa-check-circle"> Font Awesome is working!</i>
		</>
	);
}

export default App;
