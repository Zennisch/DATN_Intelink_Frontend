import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";
import { useEffect } from "react";
import { setupAxios } from "./services/AxiosConfig";

function App() {
	useEffect(() => {
		setupAxios();
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
