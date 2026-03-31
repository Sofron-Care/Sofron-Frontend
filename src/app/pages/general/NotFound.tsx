import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="page-center">
      <div className="page-center__content">
        <Title level={2}>{t("errors.404.title")}</Title>
        <Text type="secondary">{t("errors.404.description")}</Text>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => navigate("/demo")}>
            {t("errors.404.cta")}
          </Button>
        </div>
      </div>
    </div>
  );
}
