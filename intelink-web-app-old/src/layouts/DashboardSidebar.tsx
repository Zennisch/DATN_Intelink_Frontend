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
		icon: "🆕",
		onClick: () => {
			setCreateNewModalOpen(true);
		},
	};

	const logoutButton: NavigationButton = {
		text: "Log Out",
		icon: "🚪",
		onClick: () => {},
	};

	const navigationButtons: Array<NavigationButton & { page: Page }> = [
		{
			text: "Overview",
			icon: "📊",
			page: "overview",
			onClick: () => {
				setCurrentPage("overview");
			},
		},
		{
			text: "Links",
			icon: "🔗",
			page: "links",
			onClick: () => {
				setCurrentPage("links");
			},
		},
		{
			text: "Statistics",
			icon: "📈",
			page: "statistics",
			onClick: () => {
				setCurrentPage("statistics");
			},
		},
		{
			text: "APIs",
			icon: "⚙️",
			page: "apis",
			onClick: () => {
				setCurrentPage("apis");
			},
		},
		{
			text: "Domains",
			icon: "🌐",
			page: "domains",
			onClick: () => {
				setCurrentPage("domains");
			},
		},
	];

	return (
		<div className="flex flex-col w-52 bg-white p-4 gap-4 shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-10">
			<Logo />

			{/* Navigation Buttons */}
			<div className="flex flex-1 flex-col justify-between">
				<div className="flex flex-col gap-2">
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start mb-4"
						icon={<span>{createNewButton.icon}</span>}
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
									isActive ? "text-black bg-gray-200!" : ""
								}`}
								icon={<span>{button.icon}</span>}
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
						className="w-full justify-start"
						icon={<span>{logoutButton.icon}</span>}
						onClick={logoutButton.onClick}
					>
						{logoutButton.text}
					</Button>
				</div>
			</div>
		</div>
	);
};
