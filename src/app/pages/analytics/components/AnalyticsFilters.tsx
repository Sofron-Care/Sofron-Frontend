import { Select, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  range: string;
  setRange: (value: string) => void;
}

export default function AnalyticsFilters({ range, setRange }: Props) {
  const { t } = useTranslation();

  return (
    <Row className="analytics-filters">
      <Col>
        <Select
          value={range}
          onChange={setRange}
          className="analytics-range-select"
          options={[
            { value: "all", label: t("analytics.ranges.all") },
            { value: "7", label: t("analytics.ranges.last7") },
            { value: "30", label: t("analytics.ranges.last30") },
            { value: "90", label: t("analytics.ranges.last90") },
            { value: "ytd", label: t("analytics.ranges.ytd") },
          ]}
        />
      </Col>
    </Row>
  );
}
