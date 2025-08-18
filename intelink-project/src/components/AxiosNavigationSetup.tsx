import { useEffect } from "react";
import {
	useAxiosNavigation,
	setGlobalNavigateToLogin,
} from "../contexts/AxiosNavigationContext";

export const AxiosNavigationSetup: React.FC = () => {
	const { navigateToLogin } = useAxiosNavigation();

	useEffect(() => {
		setGlobalNavigateToLogin(navigateToLogin);
	}, [navigateToLogin]);

	return null;
};
