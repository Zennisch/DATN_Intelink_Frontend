import { Logo } from "../components/etc/Logo";
import { Button } from "../components/primary";
import type { Page } from "./DashboardLayout";

interface NavigationButton {
	text: string;
	icon: string;
	onClick: () => void;
}

interface DashboardSidebarProps {
	currentPage: Page;
	setCurrentPage: (page: Page) => void;
	setCreateNewModalOpen: (open: boolean) => void;
}

export const DashboardSidebar = ({
	currentPage,
	setCurrentPage,
	setCreateNewModalOpen,
}: DashboardSidebarProps) => {
	const createNewButton: NavigationButton = {
		text: "Create New",
		icon: "fas fa-plus-circle",
		onClick: () => {
			setCreateNewModalOpen(true);
		},
	};

	const navigationButtons: Array<NavigationButton & { page: Page }> = [
		{
			text: "Overview",
			icon: "fas fa-tachometer-alt",
			page: "overview",
			onClick: () => {
				setCurrentPage("overview");
			},
		},
		{
			text: "Links",
			icon: "fas fa-link",
			page: "links",
			onClick: () => {
				setCurrentPage("links");
			},
		},
		{
			text: "Statistics",
			icon: "fas fa-chart-bar",
			page: "statistics",
			onClick: () => {
				setCurrentPage("statistics");
			},
		},
		{
			text: "APIs",
			icon: "fas fa-cogs",
			page: "apis",
			onClick: () => {
				setCurrentPage("apis");
			},
		},
		{
			text: "Domains",
			icon: "fas fa-globe",
			page: "domains",
			onClick: () => {
				setCurrentPage("domains");
			},
		},
	];

	const logoutButton: NavigationButton = {
		text: "Log Out",
		icon: "fas fa-sign-out-alt",
		onClick: () => {},
	};

	return (
		<div className="flex flex-col w-52 bg-[#2a2a2a] p-4 gap-4">
			<Logo />

			{/* Navigation Buttons */}
			<div className="flex flex-1 flex-col justify-between">
				<div className="flex flex-col gap-2">
					<Button
						variant="primary"
						size="sm"
						className="w-full text-gray-300! bg-blue-700! hover:bg-gray-700! justify-start mb-4"
						icon={<i className={createNewButton.icon}></i>}
						onClick={createNewButton.onClick}
					>
						Create New
					</Button>

					{navigationButtons.map((button, index) => {
						const isActive = currentPage === button.page;
						return (
							<Button
								key={index}
								size="sm"
								variant="ghost"
								className={`w-full justify-start ${
									isActive
										? "text-white! bg-gray-700!"
										: "text-gray-300! hover:bg-gray-700"
								}`}
								icon={<i className={button.icon}></i>}
								onClick={button.onClick}
							>
								{button.text}
							</Button>
						);
					})}
				</div>
				<div>
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-gray-300! hover:bg-gray-700 justify-start"
						icon={<i className={logoutButton.icon}></i>}
						onClick={logoutButton.onClick}
					>
						{logoutButton.text}
					</Button>
				</div>
			</div>
		</div>
	);
};
