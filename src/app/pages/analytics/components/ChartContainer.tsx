import { Card } from "antd";
import type { ReactNode } from "react";

interface Props {
  title: string;
  data?: any;
  children: ReactNode;
}

export default function ChartContainer({ title, children }: Props) {
  return (
    <Card className="analytics-chart-card" title={title}>
      <div className="analytics-chart-body">{children}</div>
    </Card>
  );
}
