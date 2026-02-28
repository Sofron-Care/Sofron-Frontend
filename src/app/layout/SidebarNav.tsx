import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { MenuProps } from "antd";

export default function SidebarNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    { key: "/demo/app", label: t("appnav.dashboard") },
    { key: "/demo/app/appointments", label: t("appnav.appointments") },
    {
      key: "/demo/app/specialists",
      label: t("appnav.specialists"),
    },
    { key: "/demo/app/services", label: t("appnav.services") },
    { key: "/demo/app/schedule", label: t("appnav.schedule") },
    { key: "/demo/app/patients", label: t("appnav.patients") },
    { key: "/demo/app/documents", label: t("appnav.documents") },
    { key: "/demo/app/analytics", label: t("appnav.analytics") },
    { type: "divider" },
    { key: "/demo/app/settings", label: t("appnav.settings") },
    { key: "/demo/app/help", label: t("appnav.help") },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <img src="/images/brand/logo-teal.svg" alt="Sofron" height={28} />
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0, flex: 1 }}
      />
    </div>
  );
}
