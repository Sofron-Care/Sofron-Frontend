import { Bar, Pie } from "react-chartjs-2";
import { Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import ChartContainer from "../components/ChartContainer";

export default function DemographicsTab({ data = {} }: any) {
  const { t } = useTranslation();

  const age = data.ageDistribution || [];
  const gender = data.genderBreakdown || [];
  const activity = data.activityBreakdown || [];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  const ageOrder = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "66+"];

  const sortedAge = [...age].sort(
    (a, b) => ageOrder.indexOf(a.age_bucket) - ageOrder.indexOf(b.age_bucket),
  );
  const ageData = {
    labels: sortedAge.map((d) => d.age_bucket),
    datasets: [
      {
        label: t("analytics.demographics.visits"),
        data: sortedAge.map((d) => Number(d.total_visits)),
        backgroundColor: "#0D9488",
        borderRadius: 6,
      },
    ],
  };

  const genderData = {
    labels: gender.map((d: any) => d.gender),
    datasets: [
      {
        data: gender.map((d: any) => Number(d.total_visits)),
        backgroundColor: [
          "#0D9488",
          "#14B8A6",
          "#2DD4BF",
          "#5EEAD4",
          "#99F6E4",
          "#CCFBF1",
          "#134E4A",
          "#0F766E",
        ],
      },
    ],
  };

  const activityData = {
    labels: activity.map((d: any) => d.activityLevel),
    datasets: [
      {
        data: activity.map((d: any) => Number(d.total_visits)),
        backgroundColor: ["#0D9488", "#14B8A6", "#2DD4BF", "#5EEAD4"],
      },
    ],
  };

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <ChartContainer title={t("analytics.demographics.ageDistribution")}>
          <div className="analytics-chart-body">
            <Bar data={ageData} options={chartOptions} />
          </div>
        </ChartContainer>
      </Col>

      <Col span={12}>
        <ChartContainer title={t("analytics.demographics.genderDistribution")}>
          <div className="analytics-chart-body">
            <Pie data={genderData} options={chartOptions} />
          </div>
        </ChartContainer>
      </Col>

      <Col span={24}>
        <ChartContainer title={t("analytics.demographics.activityLevel")}>
          <div className="analytics-chart-body">
            <Pie data={activityData} options={chartOptions} />
          </div>
        </ChartContainer>
      </Col>
    </Row>
  );
}
