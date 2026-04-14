import { Tabs, Card } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "./../../auth/AuthContext";

import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import OrganizationSettings from "./components/OrganizationSettings";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isAdmin =
    user?.role === "clinicAdmin" || user?.role === "freelanceAdmin";

  return (
    <div className="page-container">
      <Card className="content-card">
        <Tabs defaultActiveKey="profile">
          <Tabs.TabPane tab={t("settings.profile")} key="profile">
            <ProfileSettings />
          </Tabs.TabPane>

          <Tabs.TabPane tab={t("settings.notifications")} key="notifications">
            <NotificationSettings />
          </Tabs.TabPane>

          {isAdmin && (
            <Tabs.TabPane tab={t("settings.organization")} key="organization">
              <OrganizationSettings />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
