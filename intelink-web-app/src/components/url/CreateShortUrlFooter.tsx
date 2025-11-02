import { Button } from "../primary";

interface CreateShortUrlFooterProps {
	onCancel: () => void;
}

export const CreateShortUrlFooter = ({
	onCancel,
}: CreateShortUrlFooterProps) => {
	return (
		<div className="flex items-center justify-between pt-6 border-t border-gray-200">
			<div className="text-sm text-gray-500">
				<i className="fas fa-info-circle mr-1"></i>
				All fields are optional except Original URL
			</div>
			<div className="flex gap-3">
				<Button type="button" variant="ghost" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="primary">
					<i className="fas fa-link mr-2"></i>
					Create Short URL
				</Button>
			</div>
		</div>
	);
};
