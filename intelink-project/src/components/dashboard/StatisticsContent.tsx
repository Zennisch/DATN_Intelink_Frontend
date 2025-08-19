import React, { useState } from "react";
import { StatisticsDashboard } from "../statistic/StatisticsDashboard";

export const StatisticsContent: React.FC = () => {
	const [shortcode, setShortcode] = useState<string>("");
	const [currentShortcode, setCurrentShortcode] = useState<string>("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (shortcode.trim()) {
			setCurrentShortcode(shortcode.trim());
		}
	};

	return (
		<div className="space-y-6">
			{!currentShortcode ? (
				<div className="flex items-center justify-center min-h-96">
					<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
						<h1 className="text-2xl font-bold text-center mb-6">
							Bảng điều khiển thống kê
						</h1>
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="shortcode"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Nhập mã rút gọn
								</label>
								<input
									type="text"
									id="shortcode"
									value={shortcode}
									onChange={(e) => setShortcode(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Nhập mã rút gọn..."
									required
								/>
							</div>
							<button
								type="submit"
								className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
							>
								Xem thống kê
							</button>
						</form>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold text-gray-900">
							Thống kê cho: {currentShortcode}
						</h1>
						<button
							onClick={() => {
								setCurrentShortcode("");
								setShortcode("");
							}}
							className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
						>
							← Nhập mã khác
						</button>
					</div>
					<StatisticsDashboard shortcode={currentShortcode} />
				</div>
			)}
		</div>
	);
};
