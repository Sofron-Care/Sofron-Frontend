import { Form, Input, Button, Space, Typography, message, Divider } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "./../../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import api from "./../../../../shared/api/axios";

const { Title, Text } = Typography;

export default function ProfileSettings() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.patch("/users/me", values);

      const updatedUser = res.data.data.updatedUser;

      setUser((prev) => ({
        ...prev!,
        ...updatedUser,
      }));

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...updatedUser,
        }),
      );

      message.success(t("common.saved"));
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    setEmailLoading(true);
    try {
      const res = await api.post("/auth/request-email-change");

      message.success(res.data.message);
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    try {
      const res = await api.post("/auth/request-password-change");

      message.success(res.data.message);
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={5}>{t("settings.profileInfo")}</Title>

        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label={t("settings.firstName")}
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t("settings.lastName")}
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.phone")} name="phone">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            {t("common.save")}
          </Button>
        </Form>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t("settings.emailSection")}</Title>

        <Space direction="vertical">
          <Text strong>{user.email}</Text>

          <Button onClick={handleEmailChange} loading={emailLoading}>
            {t("settings.changeEmail")}
          </Button>
        </Space>
      </div>

      <Divider />

      <div>
        <Title level={5}>{t("settings.security")}</Title>

        <Button onClick={handlePasswordChange} loading={passwordLoading}>
          {t("settings.resetPassword")}
        </Button>
      </div>
    </Space>
  );
}
