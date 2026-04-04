import { Tabs, Space, Button } from "antd";
import { useState } from "react";
import PageLayout from "./../../layout/PageLayout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import OverviewTab from "./components/tabs/OverviewTab";
import AppointmentsTab from "./components/tabs/AppointmentsTab";
import FavoritesTab from "./components/tabs/FavoritesTab";
import ReviewsTab from "./components/tabs/ReviewsTab";
import Footer from "../home/components/Footer";
import { useAuth } from "../../auth/AuthContext";

export default function ClientDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    navigate("/demo");
  };

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
  ];

  return (
    <PageLayout
      className="client-dashboard-layout"
      title={t("clientDashboard.title")}
      subtitle={t("clientDashboard.subtitle")}
      secondaryActions={
        <div className="client-dashboard__header-actions">
          <Space>
            <Button type="text" onClick={() => navigate("/")}>
              {t("common.home")}
            </Button>

            <Button type="text" danger onClick={handleLogout}>
              {t("common.logout")}
            </Button>
          </Space>
        </div>
      }
    >
      <div className="client-dashboard">
        <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />
      </div>
      <Footer />
    </PageLayout>
  );
}
