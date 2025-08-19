import React, { useState } from "react";
import { AuthenticatedHeader } from "./AuthenticatedHeader";
import { Sidebar } from "./Sidebar";

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
		// Implement language change logic here
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

			{/* Main content area */}
			<div className="md:ml-64">
				{/* Header */}
				<AuthenticatedHeader
					onSidebarToggle={toggleSidebar}
					onLanguageChange={handleLanguageChange}
				/>

				{/* Page content */}
				<main className="pt-16 min-h-screen">
					<div className="p-6">{children}</div>
				</main>
			</div>
		</div>
	);
};
