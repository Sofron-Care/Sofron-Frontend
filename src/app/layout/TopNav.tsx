import { Space, Typography, Button, Avatar } from "antd";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export default function TopNav() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/demo/login", { replace: true });
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text strong>{t("dashboard.welcome", { name: user?.firstName })}</Text>

      <Space>
        <Avatar>{user?.firstName?.[0]}</Avatar>
        <Button type="text" onClick={handleLogout}>
          {t("appnav.logout")}
        </Button>
      </Space>
    </div>
  );
}
