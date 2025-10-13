import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "../../components/atoms/Button";
import TextInput from "../../components/atoms/TextInput";
import { Toast } from "../../components/ui";
import { Ionicons } from '@expo/vector-icons';
import { copyToClipboard } from "../../utils/clipboard";
import { ApiKeyService, type ApiKeyResponse, type CreateApiKeyRequest } from "../../services/ApiKeyService";

export default function ApiKeysScreen() {
	const router = useRouter();
	const [apiKeys, setApiKeys] = useState<ApiKeyResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showKeyModal, setShowKeyModal] = useState(false);
	const [createdKey, setCreatedKey] = useState<ApiKeyResponse | null>(null);
	const [newKeyData, setNewKeyData] = useState<CreateApiKeyRequest>({
		name: "",
		rateLimitPerHour: 1000,
		active: true,
	});
	const [toast, setToast] = useState<{
		visible: boolean;
		message: string;
		type: "success" | "error" | "info" | "warning";
	}>({
		visible: false,
		message: "",
		type: "info",
	});

	const fetchApiKeys = async () => {
		setLoading(true);
		try {
			const data = await ApiKeyService.list();
			data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			setApiKeys(data);
		} catch (err: any) {
			setToast({
				visible: true,
				message: err.message || "Failed to load API keys",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchApiKeys();
	}, []);

	const handleCreate = async () => {
		if (!newKeyData.name.trim()) {
			setToast({
				visible: true,
				message: "Please enter a name for the API key",
				type: "warning",
			});
			return;
		}

		try {
			const response = await ApiKeyService.create(newKeyData);
			setShowCreateModal(false);
			setCreatedKey(response);
			setShowKeyModal(true);
			setNewKeyData({
				name: "",
				rateLimitPerHour: 1000,
				active: true,
			});
			await fetchApiKeys();
		} catch (err: any) {
			setToast({
				visible: true,
				message: err.message || "Failed to create API key",
				type: "error",
			});
		}
	};

	const handleDelete = async (id: string) => {
		Alert.alert(
			"Delete API Key",
			"Are you sure you want to delete this API key?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await ApiKeyService.delete(id);
							setToast({
								visible: true,
								message: "API key deleted successfully!",
								type: "success",
							});
							await fetchApiKeys();
						} catch (err: any) {
							setToast({
								visible: true,
								message: err.message || "Failed to delete API key",
								type: "error",
							});
						}
					},
				},
			]
		);
	};

	const handleCopyKey = async () => {
		if (createdKey?.rawKey) {
			const success = await copyToClipboard(createdKey.rawKey);
			if (success) {
				setToast({
					visible: true,
					message: "API key copied to clipboard!",
					type: "success",
				});
			} else {
				setToast({
					visible: true,
					message: "Failed to copy API key",
					type: "error",
				});
			}
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50">
			{/* Header */}
			<View className="bg-white border-b border-gray-200 px-4 py-3">
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center">
						<TouchableOpacity onPress={() => router.back()} className="mr-4">
							<Ionicons name="arrow-back" size={24} color="#374151" />
						</TouchableOpacity>
						<Text className="text-xl font-semibold text-gray-900">
							API Keys
						</Text>
					</View>
					<Button
						onPress={() => setShowCreateModal(true)}
						variant="primary"
						size="sm"
						icon={<Ionicons name="add" size={16} color="white" />}
						iconPosition="left"
					>
						Create
					</Button>
				</View>
			</View>

			<ScrollView className="flex-1 px-4 py-6">
				{loading ? (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<Text className="text-center text-gray-500">Loading...</Text>
					</View>
				) : apiKeys.length === 0 ? (
					<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
						<View className="items-center">
							<Ionicons name="key-outline" size={48} color="#9CA3AF" />
							<Text className="text-lg font-medium text-gray-900 mt-4 mb-2">
								No API Keys
							</Text>
							<Text className="text-gray-500 text-center mb-6">
								Create your first API key to start using the Intelink API
							</Text>
							<Button
								onPress={() => setShowCreateModal(true)}
								variant="primary"
								icon={<Ionicons name="add" size={20} color="white" />}
								iconPosition="left"
							>
								Create API Key
							</Button>
						</View>
					</View>
				) : (
					<View className="space-y-4">
						{apiKeys.map((key) => (
							<View key={key.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
								<View className="flex-row justify-between items-start mb-3">
									<View className="flex-1">
										<Text className="text-lg font-semibold text-gray-900 mb-1">
											{key.name}
										</Text>
										<Text className="text-sm text-gray-600 font-mono">
											{key.keyPrefix}...
										</Text>
									</View>
									<View className="items-end">
										<View className={`px-2 py-1 rounded-full ${key.active ? "bg-green-100" : "bg-gray-100"}`}>
											<Text className={`text-xs font-medium ${key.active ? "text-green-700" : "text-gray-500"}`}>
												{key.active ? "Active" : "Inactive"}
											</Text>
										</View>
									</View>
								</View>

								<View className="flex-row justify-between items-center mb-3">
									<View>
										<Text className="text-xs text-gray-500">Rate Limit</Text>
										<Text className="text-sm font-medium text-gray-900">
											{key.rateLimitPerHour}/hour
										</Text>
									</View>
									<View>
										<Text className="text-xs text-gray-500">Created</Text>
										<Text className="text-sm font-medium text-gray-900">
											{formatDate(key.createdAt)}
										</Text>
									</View>
								</View>

								<View className="flex-row justify-end space-x-2 pt-3 border-t border-gray-100">
									<TouchableOpacity
										onPress={() => handleDelete(key.id)}
										className="px-3 py-1 rounded bg-red-50"
									>
										<Text className="text-xs text-red-600">Delete</Text>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</View>
				)}
			</ScrollView>

			{/* Create Modal */}
			<Modal
				visible={showCreateModal}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setShowCreateModal(false)}
			>
				<View className="flex-1 bg-black/50 justify-center items-center p-4">
					<View className="bg-white rounded-lg p-6 w-full max-w-md">
						<Text className="text-xl font-semibold text-gray-900 mb-4">
							Create API Key
						</Text>
						
						<View className="space-y-4">
							<TextInput
								label="Name"
								placeholder="Enter API key name"
								value={newKeyData.name}
								onChangeText={(text) => setNewKeyData(prev => ({ ...prev, name: text }))}
								fullWidth
							/>
							
							<TextInput
								label="Rate Limit Per Hour"
								placeholder="1000"
								value={newKeyData.rateLimitPerHour.toString()}
								onChangeText={(text) => setNewKeyData(prev => ({ ...prev, rateLimitPerHour: parseInt(text) || 1000 }))}
								keyboardType="numeric"
								fullWidth
							/>
							
							<TouchableOpacity
								onPress={() => setNewKeyData(prev => ({ ...prev, active: !prev.active }))}
								className="flex-row items-center"
							>
								<View className={`w-5 h-5 rounded border-2 mr-2 ${newKeyData.active ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
									{newKeyData.active && (
										<Ionicons name="checkmark" size={16} color="white" />
									)}
								</View>
								<Text className="text-gray-700">Active</Text>
							</TouchableOpacity>
						</View>

						<View className="flex-row space-x-3 mt-6">
							<Button
								onPress={() => setShowCreateModal(false)}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								onPress={handleCreate}
								variant="primary"
								className="flex-1"
								loading={loading}
							>
								Create
							</Button>
						</View>
					</View>
				</View>
			</Modal>

			{/* Show Key Modal */}
			<Modal
				visible={showKeyModal}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setShowKeyModal(false)}
			>
				<View className="flex-1 bg-black/50 justify-center items-center p-4">
					<View className="bg-white rounded-lg p-6 w-full max-w-lg">
						<View className="flex-row justify-between items-center mb-4">
							<Text className="text-xl font-semibold text-green-700">
								API Key Created
							</Text>
							<TouchableOpacity onPress={() => setShowKeyModal(false)}>
								<Ionicons name="close" size={24} color="#6B7280" />
							</TouchableOpacity>
						</View>
						
						<Text className="text-gray-700 mb-4">
							Please copy and save your API key. You will not be able to see it again!
						</Text>
						
						<View className="bg-gray-100 rounded-lg p-4 mb-4">
							<Text className="font-mono text-blue-700 break-all">
								{createdKey?.rawKey}
							</Text>
						</View>
						
						<Button
							onPress={handleCopyKey}
							variant="primary"
							fullWidth
							icon={<Ionicons name="copy" size={20} color="white" />}
							iconPosition="left"
						>
							Copy API Key
						</Button>
					</View>
				</View>
			</Modal>

			<Toast
				visible={toast.visible}
				message={toast.message}
				type={toast.type}
				onHide={() => setToast(prev => ({ ...prev, visible: false }))}
			/>
		</SafeAreaView>
	);
}
