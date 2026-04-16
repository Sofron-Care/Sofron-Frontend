import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  labels: string[];
  values: number[];
}

export default function BarChart({ labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        backgroundColor: "#0D9488",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 10 },
        },
      },
      y: {
        ticks: {
          font: { size: 10 },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
