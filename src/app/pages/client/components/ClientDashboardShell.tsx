import { Space, Button, Tabs } from "antd";
import PageLayout from "../../../layout/PageLayout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { useState, useEffect } from "react";
import OverviewTab from "./../components/tabs/OverviewTab";
import AppointmentsTab from "./../components/tabs/AppointmentsTab";
import FavoritesTab from "./../components/tabs/FavoritesTab";
import ReviewsTab from "./../components/tabs/ReviewsTab";
import SettingsTab from "./../components/tabs/SettingsTab";
import { useDemo } from "../../../demo/useDemo";

function ClientDashboardShell() {
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/demo");
  };

  const { tabOverride } = useDemo();

  useEffect(() => {
    if (tabOverride) {
      setActiveTab(tabOverride);
    }
  }, [tabOverride]);

  const items = [
    {
      key: "overview",
      label: t("clientDashboard.tabs.overview"),
      children: <OverviewTab />,
    },
    {
      key: "appointments",
      label: t("clientDashboard.tabs.appointments"),
      children: <AppointmentsTab />,
    },
    {
      key: "favorites",
      label: t("clientDashboard.tabs.favorites"),
      children: <FavoritesTab />,
    },
    {
      key: "reviews",
      label: t("clientDashboard.tabs.reviews"),
      children: <ReviewsTab />,
    },
    {
      key: "settings",
      label: t("clientDashboard.tabs.settings"),
      children: <SettingsTab />,
    },
  ];

  return (
    <div className="client-dashboard-page">
      <div className="client-dashboard-topbar">
        <div className="client-dashboard-topbar__brand">
          <img
            src="./../public/images/brand/icon-teal.svg"
            alt="Sofron"
            className="client-dashboard-topbar__logo"
          />
          <div className="client-dashboard-topbar__brand-text">
            <span className="client-dashboard-topbar__eyebrow">
              {t("clientDashboard.branding.portal")}
            </span>
            <span className="client-dashboard-topbar__name">Sofron</span>
          </div>
        </div>

        <Space>
          <Button type="text" onClick={() => navigate("/demo")}>
            {t("common.home")}
          </Button>

          <Button type="text" danger onClick={handleLogout}>
            {t("common.logout")}
          </Button>
        </Space>
      </div>

      <PageLayout
        className="client-dashboard-layout"
        title={t("clientDashboard.title")}
        subtitle={t("clientDashboard.subtitle")}
      >
        <div className="client-dashboard">
          <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />
        </div>
      </PageLayout>
    </div>
  );
}

export default ClientDashboardShell;
