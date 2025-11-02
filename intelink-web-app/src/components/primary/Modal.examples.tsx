import { useState } from "react";
import { Modal, Button, Input } from "./index";

/**
 * Modal Component Usage Examples
 *
 * Demonstrates various use cases for the Modal component following
 * the established design pattern of the component library.
 */

export function ModalExamples() {
	const [basicOpen, setBasicOpen] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [formOpen, setFormOpen] = useState(false);
	const [loadingOpen, setLoadingOpen] = useState(false);
	const [sizeOpen, setSizeOpen] = useState(false);
	const [positionOpen, setPositionOpen] = useState(false);

	const handleSubmit = () => {
		setLoadingOpen(true);
		// Simulate API call
		setTimeout(() => {
			setLoadingOpen(false);
			alert("Form submitted!");
		}, 2000);
	};

	return (
		<div className="p-8 space-y-4">
			<h1 className="text-2xl font-bold mb-6">Modal Component Examples</h1>

			{/* Basic Modal */}
			<div>
				<Button onClick={() => setBasicOpen(true)}>Open Basic Modal</Button>
				<Modal
					open={basicOpen}
					onClose={() => setBasicOpen(false)}
					title="Basic Modal"
				>
					<p>This is a basic modal with default settings.</p>
					<p className="mt-2">
						It includes a close button and can be closed by clicking the
						backdrop or pressing Escape.
					</p>
				</Modal>
			</div>

			{/* Confirmation Dialog */}
			<div>
				<Button onClick={() => setConfirmOpen(true)} variant="primary">
					Open Confirmation Dialog
				</Button>
				<Modal
					open={confirmOpen}
					onClose={() => setConfirmOpen(false)}
					title="Confirm Action"
					size="sm"
					closeOnBackdropClick={false}
					footer={
						<>
							<Button variant="ghost" onClick={() => setConfirmOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={() => {
									alert("Confirmed!");
									setConfirmOpen(false);
								}}
							>
								Confirm
							</Button>
						</>
					}
				>
					<p>Are you sure you want to perform this action?</p>
					<p className="mt-2 text-sm text-gray-500">
						This action cannot be undone.
					</p>
				</Modal>
			</div>

			{/* Form Modal */}
			<div>
				<Button onClick={() => setFormOpen(true)} variant="outline">
					Open Form Modal
				</Button>
				<Modal
					open={formOpen}
					onClose={() => setFormOpen(false)}
					title="User Information"
					size="md"
					footer={
						<>
							<Button variant="ghost" onClick={() => setFormOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={() => {
									alert("Form saved!");
									setFormOpen(false);
								}}
							>
								Save
							</Button>
						</>
					}
				>
					<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
						<Input label="Full Name" placeholder="Enter your name" fullWidth />
						<Input
							label="Email"
							type="email"
							placeholder="Enter your email"
							fullWidth
						/>
						<Input
							label="Phone"
							type="tel"
							placeholder="Enter your phone"
							fullWidth
						/>
					</form>
				</Modal>
			</div>

			{/* Loading Modal */}
			<div>
				<Button onClick={handleSubmit}>Submit with Loading</Button>
				<Modal
					open={loadingOpen}
					onClose={() => setLoadingOpen(false)}
					title="Processing"
					loading={true}
					closeOnBackdropClick={false}
					showCloseButton={false}
				>
					<p>Please wait while we process your request...</p>
				</Modal>
			</div>

			{/* Different Sizes */}
			<div>
				<Button onClick={() => setSizeOpen(true)} variant="secondary">
					Open Large Modal
				</Button>
				<Modal
					open={sizeOpen}
					onClose={() => setSizeOpen(false)}
					title="Large Modal"
					size="xl"
				>
					<div className="space-y-4">
						<p>This is a large modal that can contain more content.</p>
						<p>Available sizes: sm, md (default), lg, xl, full</p>
						<div className="bg-gray-100 p-4 rounded">
							<h3 className="font-semibold mb-2">Example Content Section</h3>
							<p>
								You can add any content here including forms, tables, images,
								etc.
							</p>
						</div>
						<div className="bg-gray-100 p-4 rounded">
							<h3 className="font-semibold mb-2">Another Section</h3>
							<p>
								The modal body is scrollable when content exceeds the viewport
								height.
							</p>
						</div>
					</div>
				</Modal>
			</div>

			{/* Position Variants */}
			<div>
				<Button onClick={() => setPositionOpen(true)}>
					Open Top Positioned Modal
				</Button>
				<Modal
					open={positionOpen}
					onClose={() => setPositionOpen(false)}
					title="Top Positioned Modal"
					position="top"
				>
					<p>This modal appears at the top of the screen.</p>
					<p className="mt-2">
						Available positions: center (default), top, bottom
					</p>
				</Modal>
			</div>

			{/* No Header Modal */}
			<div>
				<Button variant="ghost">Custom Modal (See Code)</Button>
				<Modal
					open={false}
					onClose={() => {}}
					showCloseButton={false}
					footer={
						<Button variant="primary" onClick={() => {}}>
							Got it
						</Button>
					}
				>
					<div className="text-center py-4">
						<div className="text-4xl mb-4">🎉</div>
						<h3 className="text-xl font-semibold mb-2">Success!</h3>
						<p className="text-gray-600">
							Your changes have been saved successfully.
						</p>
					</div>
				</Modal>
			</div>
		</div>
	);
}
