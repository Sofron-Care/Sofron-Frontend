import { Switch, Space, Typography, Button, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "./../../../../shared/api/axios";

const { Title, Text } = Typography;

type EmailPreferences = {
  marketingEmailsEnabled: boolean;
  notificationEmailsEnabled: boolean;
};

export default function NotificationSettings() {
  const { t } = useTranslation();

  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketingEmailsEnabled: false,
    notificationEmailsEnabled: false,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const res = await api.get("/email-preferences/me");

        const data =
          res.data.data.emailPreference ||
          res.data.data.updatedEmailPreferences;

        setPreferences(data);
      } catch (err: any) {
        message.error(err?.response?.data?.message || t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = (key: keyof EmailPreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch("/email-preferences/me", preferences);

      const updated =
        res.data.data.updatedEmailPreferences || res.data.data.emailPreference;

      setPreferences(updated);

      message.success(t("common.saved"));
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5}>{t("settings.notificationsTitle")}</Title>
        <Text type="secondary">{t("settings.notificationsDescription")}</Text>
      </div>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Text strong>{t("settings.notificationEmails")}</Text>
          <br />
          <Text type="secondary">{t("settings.notificationEmailsDesc")}</Text>
        </div>

        <Switch
          checked={preferences.notificationEmailsEnabled}
          onChange={(checked) =>
            handleToggle("notificationEmailsEnabled", checked)
          }
          loading={loading}
        />
      </Space>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <div>
          <Text strong>{t("settings.marketingEmails")}</Text>
          <br />
          <Text type="secondary">{t("settings.marketingEmailsDesc")}</Text>
        </div>

        <Switch
          checked={preferences.marketingEmailsEnabled}
          onChange={(checked) =>
            handleToggle("marketingEmailsEnabled", checked)
          }
          loading={loading}
        />
      </Space>

      <Button type="primary" onClick={handleSave} loading={saving}>
        {t("common.save")}
      </Button>
    </Space>
  );
}
