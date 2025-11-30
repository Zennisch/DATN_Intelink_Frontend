import React, { useEffect, useState } from "react";
import { SubscriptionService } from "../services/SubscriptionService";
import type { SubscriptionResponse } from "../dto/response/SubscriptionResponse";

const SubscriptionsPage: React.FC = () => {
	const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    SubscriptionService.getAll()
    .then((res) => {
      const sorted = [...res.subscriptions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSubscriptions(sorted);
    })
    .finally(() => setLoading(false));
  }, []);

	const getStatusColor = (status: string) => {
		switch (status.toUpperCase()) {
			case "ACTIVE":
				return "bg-green-100 text-green-800 border-green-200";
			case "TRIALING":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "PAST_DUE":
				return "bg-orange-100 text-orange-800 border-orange-200";
			case "CANCELED":
				return "bg-red-100 text-red-800 border-red-200";
			case "EXPIRED":
				return "bg-gray-100 text-gray-800 border-gray-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getPlanColor = (planType: string) => {
		switch (planType.toLowerCase()) {
			case "free":
				return "text-gray-700";
			case "basic":
				return "text-blue-700";
			case "premium":
				return "text-purple-700";
			case "enterprise":
				return "text-orange-700";
			default:
				return "text-gray-700";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(price);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
					<p className="mt-4 text-gray-600">Đang tải...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8 px-3 md:px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto w-full pt-16 md:pt-20">
				<div className="mb-6 md:mb-8">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
						Gói đăng ký của tôi
					</h1>
					<p className="text-sm md:text-base text-gray-600">
						Quản lý và theo dõi các gói đăng ký của bạn
					</p>
				</div>

				{subscriptions.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-12 text-center">
						<svg
							className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400 mb-3 md:mb-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
							/>
						</svg>
						<h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
							Chưa có gói đăng ký
						</h3>
						<p className="text-sm md:text-base text-gray-600">
							Bạn chưa có gói đăng ký nào. Hãy chọn một gói phù hợp với nhu cầu
							của bạn.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{subscriptions.map((sub) => (
							<div
								key={sub.id}
								className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
							>
								<button
									onClick={() =>
										setExpanded(expanded === sub.id ? null : sub.id)
									}
									className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
								>
									<div className="flex items-center space-x-4">
										<div
											className={`text-2xl font-bold ${getPlanColor(sub.planType)}`}
										>
											{sub.planType}
										</div>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sub.status)}`}
										>
											{sub.status}
										</span>
										{sub.active && (
											<span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
												Đang hoạt động
											</span>
										)}
									</div>
									<svg
										className={`w-5 h-5 text-gray-400 transition-transform ${expanded === sub.id ? "rotate-180" : ""}`}
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{expanded === sub.id && (
									<div className="px-6 pb-6 pt-2 border-t border-gray-100">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="space-y-3">
												<div>
													<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
														Giá gói
													</p>
													<p className="text-lg font-semibold text-gray-900">
														{formatPrice(sub.planPrice)}
													</p>
												</div>

												<div>
													<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
														Bắt đầu
													</p>
													<p className="text-sm text-gray-900">
														{formatDate(sub.startsAt)}
													</p>
												</div>

												{sub.expiresAt && (
													<div>
														<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
															Hết hạn
														</p>
														<p className="text-sm text-gray-900">
															{formatDate(sub.expiresAt)}
														</p>
													</div>
												)}
											</div>

											<div className="space-y-3">
												<div>
													<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
														Tính năng
													</p>
													<div className="space-y-2">
														<div className="flex items-center text-sm">
															<svg
																className="w-4 h-4 mr-2 text-blue-600"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path
																	fillRule="evenodd"
																	d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																	clipRule="evenodd"
																/>
															</svg>
															<span className="text-gray-700">
																Tối đa <strong>{sub.maxShortUrls}</strong> short
																URLs
															</span>
														</div>
														{sub.shortCodeCustomizationEnabled && (
															<div className="flex items-center text-sm">
																<svg
																	className="w-4 h-4 mr-2 text-green-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																		clipRule="evenodd"
																	/>
																</svg>
																<span className="text-gray-700">
																	Tùy chỉnh short code
																</span>
															</div>
														)}
														{sub.statisticsEnabled && (
															<div className="flex items-center text-sm">
																<svg
																	className="w-4 h-4 mr-2 text-purple-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																		clipRule="evenodd"
																	/>
																</svg>
																<span className="text-gray-700">
																	Thống kê chi tiết
																</span>
															</div>
														)}
														{sub.customDomainEnabled && (
															<div className="flex items-center text-sm">
																<svg
																	className="w-4 h-4 mr-2 text-orange-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																		clipRule="evenodd"
																	/>
																</svg>
																<span className="text-gray-700">
																	Custom domain
																</span>
															</div>
														)}
														{sub.apiAccessEnabled && (
															<div className="flex items-center text-sm">
																<svg
																	className="w-4 h-4 mr-2 text-red-600"
																	fill="currentColor"
																	viewBox="0 0 20 20"
																>
																	<path
																		fillRule="evenodd"
																		d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																		clipRule="evenodd"
																	/>
																</svg>
																<span className="text-gray-700">
																	API Access
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										{sub.planDescription && (
											<div className="mt-4 pt-4 border-t border-gray-100">
												<p className="text-sm text-gray-600">
													{sub.planDescription}
												</p>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default SubscriptionsPage;