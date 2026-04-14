import { Card, Statistic } from "antd";

interface Props {
  title: string;
  value: number | string;
}

export default function KPIStat({ title, value }: Props) {
  return (
    <Card className="analytics-kpi-card">
      <Statistic title={title} value={value} />
    </Card>
  );
}
