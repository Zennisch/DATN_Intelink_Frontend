import { Button } from "../primary";

interface CreateShortUrlFooterProps {
	onCancel: () => void;
	onDebugLog?: () => void; // Optional debug function
}

export const CreateShortUrlFooter = ({
	onCancel,
	onDebugLog,
}: CreateShortUrlFooterProps) => {
	return (
		<div className="flex items-center justify-end pt-6 border-t border-gray-200">
			{/* <div className="text-sm text-gray-500">
				<i className="fas fa-info-circle mr-1"></i>
				All fields are optional except Original URL
			</div> */}
			<div className="flex gap-3">
				{/* Debug button - easy to comment out when not needed */}
				{/* {onDebugLog && (
					<Button
						type="button"
						variant="secondary"
						size="sm"
						onClick={onDebugLog}
					>
						<i className="fas fa-bug mr-2"></i>
						Log Access Control Data
					</Button>
				)} */}
				<Button type="button" variant="ghost" size="sm" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" variant="primary" size="sm">
					<i className="fas fa-link mr-2"></i>
					Create Short URL
				</Button>
			</div>
		</div>
	);
};
