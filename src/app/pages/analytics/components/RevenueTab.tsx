import { Bar } from "react-chartjs-2";
import ChartContainer from "../components/ChartContainer";
import { useTranslation } from "react-i18next";

export default function RevenueTab({ data = [] }: any) {
  const { t } = useTranslation();
  const rows = [...data].sort((a, b) => b.revenue - a.revenue);
  const chartData = {
    labels: data.map((s: any) => s.serviceName),
    datasets: [
      {
        label: t("analytics.sections.revenueByService"),
        data: rows.map((s: any) => s.revenue),
        backgroundColor: "#0D9488",
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ChartContainer title={t("analytics.sections.revenueByService")}>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
}
