import { ShortUrlContent } from "../../components/dashboard/ShortUrlContent";

export const ShortUrlPage = () => {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold text-gray-900">
					Manage Short URLs
				</h1>
			</div>
			<ShortUrlContent />
		</div>
	);
};
