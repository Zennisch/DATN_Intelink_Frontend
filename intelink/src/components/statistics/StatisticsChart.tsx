import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import type { DimensionStatItemResponse } from "../../dto/StatisticsDTO";

interface StatisticsChartProps {
	data: DimensionStatItemResponse[];
	title: string;
	chartType: "bar" | "doughnut";
}

const COLORS = [
	"#3B82F6",
	"#EF4444",
	"#10B981",
	"#F59E0B",
	"#8B5CF6",
	"#EC4899",
	"#06B6D4",
	"#84CC16",
	"#F97316",
	"#6366F1",
];

export const StatisticsChart: React.FC<StatisticsChartProps> = ({
	data,
	title,
	chartType,
}) => {
	if (chartType === "bar") {
		return (
			<div className="bg-white p-6 rounded-lg shadow-md h-96">
				<h3 className="text-lg font-semibold mb-4">{title}</h3>
				<ResponsiveContainer width="100%" height="90%">
					<BarChart
						data={data as object[]}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis 
							dataKey="name" 
							angle={-45} 
							textAnchor="end" 
							height={80} 
							interval={0}
							tick={{fontSize: 11}}
						/>
						<YAxis />
						<Tooltip />
						<Legend verticalAlign="top" height={36}/>
						<Bar dataKey="clicks" fill="#3B82F6" name="Clicks" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		);
	}

	return (
		<div className="bg-white p-6 rounded-lg shadow-md h-96">
			<h3 className="text-lg font-semibold mb-4">{title}</h3>
			<ResponsiveContainer width="100%" height="90%">
				<PieChart>
					<Pie
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						data={data as unknown as any[]}
						cx="50%"
						cy="50%"
						innerRadius={chartType === "doughnut" ? 60 : 0}
						outerRadius={80}
						fill="#8884d8"
						dataKey="clicks"
						label={({ name, percent }: { name?: string; percent?: number }) => {
							// Only show label if percentage is greater than 5%
							return (percent ?? 0) > 0.05 ? `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%` : '';
						}}
					>
						{data.map((_entry, index) => (
							<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};
