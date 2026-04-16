import { List } from "antd";
import ChartContainer from "../components/ChartContainer";
import { useTranslation } from "react-i18next";

export default function RevenueTab({ data = [] }: any) {
  const { t } = useTranslation();

  const rows = [...data].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  return (
    <ChartContainer title={t("analytics.sections.revenueByService")}>
      <List
        dataSource={rows}
        renderItem={(item: any, index: number) => (
          <List.Item>
            <div className="analytics-revenue-row">
              <span className="analytics-revenue-name">
                {index + 1}. {item.serviceName}
              </span>

              <strong className="analytics-revenue-value">
                ${Number(item.revenue).toFixed(2)}
              </strong>
            </div>
          </List.Item>
        )}
      />
    </ChartContainer>
  );
}
