import React, { useState } from "react";
import { AuthenticatedHeader } from "./AuthenticatedHeader.tsx";
import { Sidebar } from "./Sidebar.tsx";

interface AuthenticatedLayoutProps {
	children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
	children,
}) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const closeSidebar = () => {
		setSidebarOpen(false);
	};

	const handleLanguageChange = (language: string) => {
		console.log("Language changed to:", language);
		// TODO: Implement language change logic
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

			{/* Main content area - with left margin for sidebar on desktop */}
			<div className="md:ml-64 min-h-screen">
				{/* Header */}
				<AuthenticatedHeader
					onSidebarToggle={toggleSidebar}
					onLanguageChange={handleLanguageChange}
				/>

				{/* Page content */}
				<main className="pt-16">
					<div className="p-6">{children}</div>
				</main>
			</div>
		</div>
	);
};
