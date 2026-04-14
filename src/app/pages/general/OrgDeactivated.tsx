import { Card, Typography, Button } from "antd";
import { useAuth } from "./../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

export default function OrgDeactivated() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate("/demo/login");
  };

  return (
    <div className="centered-page">
      <Card style={{ maxWidth: 500 }}>
        <Title level={3}>{t("orgDeactivated.title")}</Title>

        <Text>{t("orgDeactivated.description")}</Text>

        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleLogout}>
            {t("common.logout")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
