import { Row, Col, List, Card } from "antd";
import { useTranslation } from "react-i18next";

export default function ServicesTab({ data = {} }: any) {
  const { t } = useTranslation();

  const mostBooked = data?.mostBooked || [];
  const highestRevenue = data?.highestRevenue || [];
  const mostCancelled = data?.mostCancelled || [];
  const revenueLost = data?.revenueLost || [];

  const renderList = (items: any[], labelKey: string, valueKey: string, isMoney = false) => (
    <List
      dataSource={items}
      renderItem={(item: any, index: number) => (
        <List.Item>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span>
              {index + 1}. {item.service_name}
            </span>
            <strong>
              {isMoney ? `$${Number(item[valueKey]).toFixed(2)}` : item[valueKey]}
            </strong>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title={t("analytics.services.mostBooked")}>
          {renderList(mostBooked, "service_name", "total_bookings")}
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t("analytics.services.highestRevenue")}>
          {renderList(highestRevenue, "service_name", "total_revenue", true)}
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t("analytics.services.mostCancelled")}>
          {renderList(mostCancelled, "service_name", "total_cancellations")}
        </Card>
      </Col>

      <Col span={12}>
        <Card title={t("analytics.services.revenueLost")}>
          {renderList(revenueLost, "service_name", "total_revenue_lost", true)}
        </Card>
      </Col>
    </Row>
  );
}