import { Doughnut } from "react-chartjs-2";
import ChartContainer from "../components/ChartContainer";
import { useTranslation } from "react-i18next";

export default function AppointmentsTab({ data }: any) {
  const { t } = useTranslation();

  const completed = Number(
    data?.completedAppointments?.[0]?.completed_count ?? 0,
  );

  const cancelled = Number(
    data?.cancelledAppointments?.[0]?.cancellation_count ?? 0,
  );

  const noShow = Number(data?.noShowAppointments?.[0]?.no_show_count ?? 0);

  const rescheduled = Number(
    data?.rescheduledAppointments?.[0]?.rescheduled_count ?? 0,
  );

  const chartData = {
    labels: [
      t("analytics.appointments.completed"),
      t("analytics.appointments.cancelled"),
      t("analytics.appointments.noShow"),
      t("analytics.appointments.rescheduled"),
    ],
    datasets: [
      {
        data: [completed, cancelled, noShow, rescheduled],
        backgroundColor: ["#0D9488", "#F59E0B", "#EF4444", "#6366F1"],
      },
    ],
  };

  return (
    <ChartContainer title={t("analytics.sections.appointmentOutcomes")}>
      <Doughnut
        key="appointments-donut"
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                font: { size: 10 },
              },
            },
          },
        }}
      />
    </ChartContainer>
  );
}
