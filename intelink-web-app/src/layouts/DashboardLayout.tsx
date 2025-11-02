import { Button } from "../components/primary";

interface DashboardLayoutProps {}

interface NavigationButton {
	text: string;
	icon: string;
	onClick: () => void;
}

export const DashboardLayout = ({}: DashboardLayoutProps) => {
	const createNewButton: NavigationButton = {
		text: "Create New",
		icon: "fas fa-plus-circle",
		onClick: () => {},
	};

	const navigationButtons: NavigationButton[] = [
		{
			text: "Overview",
			icon: "fas fa-tachometer-alt",
			onClick: () => {},
		},
		{
			text: "Links",
			icon: "fas fa-link",
			onClick: () => {},
		},
		{
			text: "Statistics",
			icon: "fas fa-chart-bar",
			onClick: () => {},
		},
		{
			text: "APIs",
			icon: "fas fa-cogs",
			onClick: () => {},
		},
		{
			text: "Domains",
			icon: "fas fa-globe",
			onClick: () => {},
		},
	];

	const logoutButton: NavigationButton = {
		text: "Log Out",
		icon: "fas fa-sign-out-alt",
		onClick: () => {},
	};

	return (
		<div className="flex flex-row min-h-screen">
			<div className="flex flex-col w-52 bg-[#2a2a2a] p-4 gap-4">
				<div className="flex items-center justify-start px-4">
					<a
						href="/"
						className="flex flex-row justify-start items-center gap-2"
					>
						<img
							src="/assets/logo.png"
							alt="Intelink Logo"
							className="h-8 w-8 mb-2"
						/>
						<h2 className="text-gray-300 text-2xl font-bold">Intelink</h2>
					</a>
				</div>

				{/* Navigation Buttons */}
				<div className="flex flex-1 flex-col justify-between">
					<div>
						<Button
							variant="primary"
              size="sm"
							className="w-full text-gray-300! bg-blue-700! hover:bg-gray-700! justify-start mb-4"
							icon={<i className={createNewButton.icon}></i>}
							onClick={createNewButton.onClick}
						>
							Create New
						</Button>

						{navigationButtons.map((button, index) => (
							<Button
								key={index}
                size="sm"
								variant="ghost"
								className="w-full text-gray-300! hover:bg-gray-700 justify-start"
								icon={<i className={button.icon}></i>}
								onClick={button.onClick}
							>
								{button.text}
							</Button>
						))}
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
			<div className="flex-1 bg-white">Dashboard Content</div>
		</div>
	);
};
