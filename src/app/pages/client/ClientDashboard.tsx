import { Tabs } from "antd";
import PageLayout from "./../../layout/PageLayout";
import { useTranslation } from "react-i18next";

import OverviewTab from "./components/tabs/OverviewTab";
import AppointmentsTab from "./components/tabs/AppointmentsTab";
import FavoritesTab from "./components/tabs/FavoritesTab";
import ReviewsTab from "./components/tabs/ReviewsTab";

export default function ClientDashboard() {
  const { t } = useTranslation();

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
        <Tabs defaultActiveKey="overview" items={items} />
      </div>
    </PageLayout>
  );
}