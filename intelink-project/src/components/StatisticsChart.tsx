import type React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"
import type { StatisticsData } from "../types/statistics"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface StatisticsChartProps {
  data: StatisticsData[]
  title: string
  chartType: "bar" | "doughnut"
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
]

export const StatisticsChart: React.FC<StatisticsChartProps> = ({ data, title, chartType }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Clicks",
        data: data.map((item) => item.clicks),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: COLORS.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  }

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex]
            return `${context.label}: ${item.clicks} (${item.percentage.toFixed(1)}%)`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  }

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = data[context.dataIndex]
            return `${context.label}: ${item.clicks} (${item.percentage.toFixed(1)}%)`
          },
        },
      },
    },
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div style={{ height: "400px" }}>
        {chartType === "bar" ? (
          <Bar data={chartData} options={barOptions} />
        ) : (
          <Doughnut data={chartData} options={doughnutOptions} />
        )}
      </div>
    </div>
  )
}
