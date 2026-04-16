import { Space, Typography, Button, Avatar, Dropdown } from "antd";
import { MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../pages/notifications/components/NotificationBell";

const { Text } = Typography;

export default function TopNav({
  onMenuClick,
  isMobile,
}: {
  onMenuClick?: () => void;
  isMobile?: boolean;
}) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/demo", { replace: true });
  };

  const menuItems = [
    {
      key: "logout",
      label: t("appnav.logout"),
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="topnav">
      <div className="topnav-left">
        {isMobile && (
          <Button type="text" icon={<MenuOutlined />} onClick={onMenuClick} />
        )}
        <Text strong>{t("dashboard.welcome", { name: user?.firstName })}</Text>
      </div>

      <Space align="center" size={12}>
        <NotificationBell />

        {/* 🔥 Avatar dropdown */}
        <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
          <Avatar style={{ cursor: "pointer" }}>{user?.firstName?.[0]}</Avatar>
        </Dropdown>

        {/* Desktop logout stays */}
        {!isMobile && (
          <Button type="text" onClick={handleLogout}>
            {t("appnav.logout")}
          </Button>
        )}
      </Space>
    </div>
  );
}
