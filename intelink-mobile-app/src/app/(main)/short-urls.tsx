
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Button from "../../components/atoms/Button";
import CustomShortUrlModal from "../../components/CustomShortUrlModal";
import TextInput from "../../components/atoms/TextInput";
import { Toast } from "../../components/ui";
import { Ionicons } from '@expo/vector-icons';
import { copyToClipboard } from "../../utils/clipboard";
import { buildPublicShortUrl } from "../../utils/UrlUtil";
import { useShortUrl } from "../../hooks/useShortUrl";
import type { SearchShortUrlRequest, CreateShortUrlRequest } from "../../services/ShortUrlService";

export default function ShortUrlsScreen() {
	// const [unlockModalVisible, setUnlockModalVisible] = useState(false);
	// const [unlockLoading, setUnlockLoading] = useState(false);
	// const [unlockError, setUnlockError] = useState<string | undefined>(undefined);
	// const [unlockShortCode, setUnlockShortCode] = useState<string | undefined>(undefined);
	// const [unlockShortUrl, setUnlockShortUrl] = useState<string | undefined>(undefined);
	const FRONTEND_URL = process.env.VITE_FRONTEND_URL;
	const [modalVisible, setModalVisible] = useState(false);
	const [modalLoading, setModalLoading] = useState(false);
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(0);
	const [toast, setToast] = useState<{
		visible: boolean;
		message: string;
		type: "success" | "error" | "info" | "warning";
	}>({
		visible: false,
		message: "",
		type: "info",
	});

	const {
		shortUrls,
		totalElements,
		totalPages,
		loading,
		error,
		fetchShortUrls,
		createShortUrl,
		deleteShortUrl,
		enableShortUrl,
		disableShortUrl,
		clearError,
	} = useShortUrl();

	// Fetch short URLs on component mount and when filters change
	useEffect(() => {
		const searchParams: SearchShortUrlRequest = {
			page: currentPage,
			size: 10,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(searchParams);
	}, [currentPage, searchQuery, statusFilter, fetchShortUrls]);

	const handleCreateShortUrl = async (urlData: CreateShortUrlRequest) => {
		setModalLoading(true);
		try {
			await createShortUrl(urlData);
			setToast({
				visible: true,
				message: "Short URL created successfully!",
				type: "success",
			});
			// Refresh list
			const searchParams: SearchShortUrlRequest = {
				page: currentPage,
				size: 10,
				query: searchQuery || undefined,
				status: statusFilter || undefined,
				sortBy: "createdAt",
				sortDirection: "desc",
			};
			await fetchShortUrls(searchParams);
			setModalVisible(false);
		} catch (e: any) {
			setToast({
				visible: true,
				message: e?.response?.data?.message || "Failed to create short URL",
				type: "error",
			});
		} finally {
			setModalLoading(false);
		}
	};

	const handleDeleteShortUrl = async (shortCode: string) => {
		Alert.alert(
			"Delete Short URL",
			"Are you sure you want to delete this Short URL?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteShortUrl(shortCode);
							setToast({
								visible: true,
								message: "Short URL deleted successfully!",
								type: "success",
							});
							// Refresh the list
							const searchParams: SearchShortUrlRequest = {
								page: currentPage,
								size: 10,
								query: searchQuery || undefined,
								status: statusFilter || undefined,
								sortBy: "createdAt",
								sortDirection: "desc",
							};
							await fetchShortUrls(searchParams);
						} catch {
							setToast({
								visible: true,
								message: "Failed to delete short URL",
								type: "error",
							});
						}
					},
				},
			]
		);
	};

	const handleToggleStatus = async (shortCode: string, currentStatus: string) => {
		try {
			const isEnabled = currentStatus === "ENABLED";
			if (isEnabled) {
				await disableShortUrl(shortCode);
			} else {
				await enableShortUrl(shortCode);
			}
			setToast({
				visible: true,
				message: `Short URL ${isEnabled ? 'disabled' : 'enabled'} successfully!`,
				type: "success",
			});
			// Refresh the list
			const searchParams: SearchShortUrlRequest = {
				page: currentPage,
				size: 10,
				query: searchQuery || undefined,
				status: statusFilter || undefined,
				sortBy: "createdAt",
				sortDirection: "desc",
			};
			await fetchShortUrls(searchParams);
		} catch {
			setToast({
				visible: true,
				message: "Failed to toggle short URL status",
				type: "error",
			});
		}
	};

	const handleCopyToClipboard = async (shortUrl: string, shortCode: string) => {
		const absolute = buildPublicShortUrl(shortCode, shortUrl);
		const success = await copyToClipboard(absolute);
		if (success) {
			setToast({
				visible: true,
				message: "URL copied to clipboard!",
				type: "success",
			});
		} else {
			setToast({
				visible: true,
				message: "Failed to copy URL",
				type: "error",
			});
		}
	};

	const getAbsoluteShortUrl = (shortUrl: string, shortCode?: string) => buildPublicShortUrl(shortCode || "", shortUrl);

	const handleSearch = () => {
		setCurrentPage(0);
		const searchParams: SearchShortUrlRequest = {
			page: 0,
			size: 10,
			query: searchQuery || undefined,
			status: statusFilter || undefined,
			sortBy: "createdAt",
			sortDirection: "desc",
		};
		fetchShortUrls(searchParams);
	};

	const handleClearFilters = () => {
		setSearchQuery("");
		setStatusFilter("");
		setCurrentPage(0);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	return (
		<SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
			<CustomShortUrlModal
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
				onSubmit={handleCreateShortUrl}
				loading={modalLoading}
			/>

			<ScrollView
				className="flex-1 px-4"
				contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}
			>
				{/* Error Display */}
				{error && (
					<View className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex-row items-center justify-between">
						<Text className="text-red-700 flex-1">{error}</Text>
						<TouchableOpacity onPress={clearError} className="ml-2">
							<Ionicons name="close" size={20} color="#DC2626" />
						</TouchableOpacity>
					</View>
				)}

				{/* Search and Filters */}
				<View className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
					<View className="space-y-4">
						<TextInput
							placeholder="Search by URL or short code..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							fullWidth
						/>

						<View className="flex-row space-x-2">
							<View className="flex-1">
								<View className="border border-gray-300 rounded-lg px-3 py-2">
									<Text className="text-gray-500 text-sm mb-1">Status</Text>
									<View className="flex-row space-x-2">
										<TouchableOpacity
											onPress={() => setStatusFilter(statusFilter === "ENABLED" ? "" : "ENABLED")}
											className={`px-3 py-1 rounded-full ${statusFilter === "ENABLED" ? "bg-green-100" : "bg-gray-100"}`}
										>
											<Text className={`text-sm ${statusFilter === "ENABLED" ? "text-green-700" : "text-gray-600"}`}>
												Active
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => setStatusFilter(statusFilter === "DISABLED" ? "" : "DISABLED")}
											className={`px-3 py-1 rounded-full ${statusFilter === "DISABLED" ? "bg-red-100" : "bg-gray-100"}`}
										>
											<Text className={`text-sm ${statusFilter === "DISABLED" ? "text-red-700" : "text-gray-600"}`}>
												Disabled
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>

						<View className="flex-row space-x-2">
							<Button
								onPress={handleSearch}
								variant="primary"
								className="flex-1"
							>
								Search
							</Button>
							<Button
								onPress={handleClearFilters}
								variant="outline"
								className="flex-1"
							>
								Clear
							</Button>
						</View>
					</View>
				</View>

				{/* Create New URL (now opens modal) */}
				<View className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Create New Short URL
					</Text>
					<Button
						onPress={() => setModalVisible(true)}
						variant="primary"
						fullWidth
					>
						Create Short URL
					</Button>
				</View>

				{/* URL List */}
				<View className="space-y-4">
					<Text className="text-lg font-semibold text-gray-900">
						Your Short URLs ({totalElements})
					</Text>

					{loading && shortUrls.length === 0 ? (
						<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
							<Text className="text-center text-gray-500">Loading...</Text>
						</View>
					) : shortUrls.length === 0 ? (
						<View className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
							<Text className="text-center text-gray-500">
								No short URLs found
							</Text>
						</View>
					) : (
						shortUrls.map((url) => (
							<View key={url.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
								{/* Header with 3-dot menu */}
								<View className="flex-row justify-between items-start mb-3">
									<View className="flex-1 mr-2">
										<Text className="text-sm text-gray-500 mb-1">Original URL</Text>
										<Text className="text-gray-900 text-sm" numberOfLines={2}>
											{url.originalUrl}
										</Text>
									</View>
									<View className="flex-row items-center">
										<TouchableOpacity
											onPress={() => handleCopyToClipboard(url.shortUrl, url.shortCode)}
											className="p-2"
										>
											<Ionicons name="copy-outline" size={20} color="#6B7280" />
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => {
												Alert.alert(
													"URL Options",
													`Manage ${url.shortCode}`,
													[
														{
															text: "View Statistics",
															onPress: () => router.push({ pathname: '/statistics', params: { shortcode: url.shortCode } })
														},
														{
															text: url.status === 'ENABLED' ? 'Disable' : 'Enable',
															onPress: () => handleToggleStatus(url.shortCode, url.status)
														},
														{
															text: "Delete",
															onPress: () => handleDeleteShortUrl(url.shortCode),
															style: "destructive"
														},
														{
															text: "Cancel",
															style: "cancel"
														}
													]
												);
											}}
											className="p-2"
										>
											<Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
										</TouchableOpacity>
									</View>
								</View>

								<View className="flex-row justify-between items-center mb-2">
									<View className="flex-1">
										<Text className="text-sm text-gray-500 mb-1">Short URL</Text>
										<TouchableOpacity
											onPress={() => {
												if (url.hasPassword) {
													// Mở trang web unlock trong browser
													const unlockUrl = `${FRONTEND_URL}/${url.shortCode}/unlock`;
													Linking.openURL(unlockUrl);
												} else {
													router.push({ pathname: '/statistics', params: { shortcode: url.shortCode } });
												}
											}}
										>
											<Text className="text-blue-600 text-sm underline" numberOfLines={1}>
												{getAbsoluteShortUrl(url.shortUrl, url.shortCode)}
											</Text>
										</TouchableOpacity>
									</View>
									<TouchableOpacity
										className="ml-2 p-1"
										onPress={() => {
											if (url.hasPassword) {
												// Mở trang web unlock trong browser
												const unlockUrl = `${FRONTEND_URL}/${url.shortCode}/unlock`;
												Linking.openURL(unlockUrl);
											} else {
												Linking.openURL(getAbsoluteShortUrl(url.shortUrl, url.shortCode));
											}
										}}
										accessibilityLabel="Open short URL in browser"
									>
										<Ionicons name="open-outline" size={18} color="#2563EB" />
									</TouchableOpacity>
								</View>

								<View className="flex-row justify-between items-center mb-3">
									<View className="flex-row space-x-4">
										<View>
											<Text className="text-xs text-gray-500">Clicks</Text>
											<Text className="text-gray-900 font-medium">{url.totalClicks}</Text>
										</View>
										<View>
											<Text className="text-xs text-gray-500">Created</Text>
											<Text className="text-gray-900 font-medium">{formatDate(url.createdAt)}</Text>
										</View>
										<View>
											<Text className="text-xs text-gray-500">Status</Text>
											<Text className={`font-medium ${url.status === 'ENABLED' ? 'text-green-600' : 'text-red-600'}`}>
												{url.status}
											</Text>
										</View>
									</View>
								</View>

								<View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
									<TouchableOpacity
										className="p-1"
										onPress={() => router.push({ pathname: '/statistics', params: { shortcode: url.shortCode } })}
									>
										<Ionicons name="stats-chart" size={20} color="#6B7280" />
									</TouchableOpacity>
									<View className="flex-row space-x-2">
										<TouchableOpacity
											onPress={() => handleToggleStatus(url.shortCode, url.status)}
											className="px-3 py-1 rounded"
											style={{ backgroundColor: url.status === 'ENABLED' ? '#FEF2F2' : '#F0FDF4' }}
										>
											<Text className={`text-xs ${url.status === 'ENABLED' ? 'text-red-600' : 'text-green-600'}`}>
												{url.status === 'ENABLED' ? 'Disable' : 'Enable'}
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => handleDeleteShortUrl(url.shortCode)}
											className="px-3 py-1 rounded bg-red-50"
										>
											<Text className="text-xs text-red-600">Delete</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						))
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mt-4">
							<View className="flex-row justify-between items-center">
								<Text className="text-sm text-gray-500">
									Showing {currentPage * 10 + 1} - {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements} results
								</Text>
								<View className="flex-row space-x-2">
									<Button
										variant="outline"
										size="sm"
										onPress={() => setCurrentPage(prev => Math.max(0, prev - 1))}
										disabled={currentPage === 0 || loading}
									>
										Previous
									</Button>
									<Button
										variant="outline"
										size="sm"
										onPress={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
										disabled={currentPage >= totalPages - 1 || loading}
									>
										Next
									</Button>
								</View>
							</View>
						</View>
					)}
				</View>
			</ScrollView>

			<Toast
				visible={toast.visible}
				message={toast.message}
				type={toast.type}
				onHide={() => setToast(prev => ({ ...prev, visible: false }))}
			/>
		</SafeAreaView>
	);
}
