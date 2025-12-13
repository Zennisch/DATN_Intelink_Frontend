import React from "react";
import {
	LineChart as RechartsLineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

interface LineChartData {
	time: string;
	clicks: number;
	allows: number;
	blocks: number;
}

interface LineChartProps {
	data: LineChartData[];
	title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title }) => {
	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			{title && (
				<h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
					{title}
				</h3>
			)}
			<ResponsiveContainer width="100%" height={400}>
				<RechartsLineChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
					<XAxis
						dataKey="time"
						stroke="#6b7280"
						style={{ fontSize: "12px" }}
					/>
					<YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
					<Tooltip
						contentStyle={{
							backgroundColor: "#fff",
							border: "1px solid #e5e7eb",
							borderRadius: "8px",
							boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
						}}
					/>
					<Legend
						wrapperStyle={{ paddingTop: "20px" }}
						iconType="line"
					/>
					<Line
						type="monotone"
						dataKey="clicks"
						stroke="#3b82f6"
						strokeWidth={2}
						dot={{ fill: "#3b82f6", r: 4 }}
						activeDot={{ r: 6 }}
						name="Clicks"
					/>
					<Line
						type="monotone"
						dataKey="allows"
						stroke="#10b981"
						strokeWidth={2}
						dot={{ fill: "#10b981", r: 4 }}
						activeDot={{ r: 6 }}
						name="Allows"
					/>
					<Line
						type="monotone"
						dataKey="blocks"
						stroke="#ef4444"
						strokeWidth={2}
						dot={{ fill: "#ef4444", r: 4 }}
						activeDot={{ r: 6 }}
						name="Blocks"
					/>
				</RechartsLineChart>
			</ResponsiveContainer>
		</div>
	);
};
