import { Tabs } from "antd";
import { useState } from "react";
import PageLayout from "./../../layout/PageLayout";
import { useTranslation } from "react-i18next";

import OverviewTab from "./components/tabs/OverviewTab";
import AppointmentsTab from "./components/tabs/AppointmentsTab";
import FavoritesTab from "./components/tabs/FavoritesTab";
import ReviewsTab from "./components/tabs/ReviewsTab";
import Footer from "../home/components/Footer";

export default function ClientDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

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
      title={t("clientDashboard.title")}
      subtitle={t("clientDashboard.subtitle")}
    >
      <div className="client-dashboard">
        <Tabs activeKey={activeTab} items={items} onChange={setActiveTab} />
      </div>
      <Footer />
    </PageLayout>
  );
}
