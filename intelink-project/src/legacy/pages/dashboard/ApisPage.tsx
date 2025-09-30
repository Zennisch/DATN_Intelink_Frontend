import { useEffect, useState } from "react";
import { ApiKeyService } from "../../services/ApiKeyService";
import type { ApiKeyResponse } from "../../dto/response/ApiKey";
import { Button } from "../../components/ui/Button";

export const ApisPage = () => {
	const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");
	const [newRateLimit, setNewRateLimit] = useState(1000);
	const [newActive, setNewActive] = useState(true);

	const fetchApiKeys = async () => {
		setLoading(true);
		try {
			const data = await ApiKeyService.list();
			// sort by createdAt desc
			data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			setApiKeys(data);
		} catch (e: unknown) {
			setError(e.message || "Failed to load API keys");
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchApiKeys();
	}, []);

	const handleDelete = async (id: string) => {
		if (!window.confirm("Delete this API key?")) return;
		await ApiKeyService.delete(id);
		fetchApiKeys();
	};

	const handleCreate = async () => {
		try {
			await ApiKeyService.create({
				name: newKeyName,
				rateLimitPerHour: newRateLimit,
				active: newActive,
			});
			setShowCreateModal(false);
			setNewKeyName("");
			setNewRateLimit(1000);
			setNewActive(true);
			fetchApiKeys();
		} catch (e: unknown) {
			setError(e.message || "Failed to create API key");
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">API Keys</h1>
				<Button
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
					onClick={() => setShowCreateModal(true)}
				>
					+ Create API Key
				</Button>
			</div>
			{error && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
					{error}
				</div>
			)}
			<div className="bg-white shadow rounded-lg overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prefix</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate Limit</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
							</tr>
						) : apiKeys.length === 0 ? (
							<tr>
								<td colSpan={5} className="text-center py-8 text-gray-400">No API keys found.</td>
							</tr>
						) : (
							apiKeys.map((key) => (
								<tr key={key.id}>
									<td className="px-6 py-4">{key.name}</td>
									<td className="px-6 py-4 font-mono text-blue-700">{key.keyPrefix}</td>
									<td className="px-6 py-4">{key.rateLimitPerHour}/hr</td>
									<td className="px-6 py-4">
										<span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${key.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
											{key.active ? "Active" : "Inactive"}
										</span>
									</td>
									<td className="px-6 py-4 text-right space-x-2">
										<Button
											className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
											onClick={() => alert("Edit functionality not implemented")}
										>
											Edit
										</Button>
										<Button
											className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
											onClick={() => handleDelete(key.id)}
										>
											Delete
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Create Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
					<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
						<h2 className="text-xl font-semibold mb-4">Create API Key</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
								<input
									type="text"
									className="w-full border border-gray-300 rounded px-3 py-2"
									value={newKeyName}
									onChange={e => setNewKeyName(e.target.value)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit Per Hour</label>
								<input
									type="number"
									className="w-full border border-gray-300 rounded px-3 py-2"
									value={newRateLimit}
									onChange={e => setNewRateLimit(Number(e.target.value))}
									min={1}
								/>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={newActive}
									onChange={e => setNewActive(e.target.checked)}
									className="mr-2"
									id="active"
								/>
								<label htmlFor="active" className="text-sm text-gray-700">Active</label>
							</div>
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<Button
								className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
								onClick={() => setShowCreateModal(false)}
							>
								Cancel
							</Button>
							<Button
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
								onClick={handleCreate}
							>
								Create
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};