import { Bar } from "react-chartjs-2";
import ChartContainer from "../components/ChartContainer";
import { useTranslation } from "react-i18next";

export default function SchedulingTab({ data }: any) {
  const { t } = useTranslation();
  console.log(data)
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const grouped: Record<number, { total: number; booked: number }> = {};

  data.forEach((slot: any) => {
    const day = slot.day;

    if (!grouped[day]) {
      grouped[day] = {
        total: 0,
        booked: 0,
      };
    }

    grouped[day].total += 1;
    grouped[day].booked += Number(slot.booked_slots);
  });

  const labels = Object.keys(grouped).map((d) => days[Number(d)]);

  const values = Object.values(grouped).map((g: any) => g.booked / g.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: t("analytics.scheduling.utilization"),
        data: values,
        backgroundColor: "#0D9488",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (v: any) => `${v * 100}%`,
        },
        max: 1,
        min: 0,
      },
    },
  };

  return (
    <ChartContainer title={t("analytics.sections.scheduleUtilization")}>
      <Bar data={chartData} options={options} />
    </ChartContainer>
  );
}
