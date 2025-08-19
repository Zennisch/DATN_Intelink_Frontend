import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type DashboardView = "overview" | "short-urls" | "statistics";

interface DashboardContextType {
	activeView: DashboardView;
	setActiveView: (view: DashboardView) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
	undefined,
);

interface DashboardProviderProps {
	children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
	children,
}) => {
	const [activeView, setActiveView] = useState<DashboardView>("overview");

	return (
		<DashboardContext.Provider value={{ activeView, setActiveView }}>
			{children}
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (context === undefined) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
};
