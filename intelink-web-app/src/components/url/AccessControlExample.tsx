import { useState } from "react";
import {
	AccessControlSection,
	type AccessControlData,
} from "./AccessControlSection";
import { Button } from "../primary";

/**
 * Example component to demonstrate AccessControlSection usage
 * This can be used for testing or as a reference
 */
export const AccessControlExample = () => {
	const [accessControl, setAccessControl] = useState<AccessControlData>({
		mode: "allow",
		countries: [],
		ipRanges: [],
	});

	const handleSubmit = () => {
		console.log("Access Control Data:", accessControl);
		alert(JSON.stringify(accessControl, null, 2));
	};

	return (
		<div className="max-w-4xl mx-auto p-8">
			<div className="bg-white rounded-lg border border-gray-200 p-6">
				<AccessControlSection
					data={accessControl}
					onChange={setAccessControl}
				/>

				<div className="mt-6 pt-6 border-t border-gray-200">
					<Button variant="primary" onClick={handleSubmit}>
						Log Access Control Data
					</Button>
				</div>
			</div>
		</div>
	);
};
