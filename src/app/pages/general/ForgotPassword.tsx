import { Form, Input, Button, message } from "antd";
import PageLayout from "../../layout/PageLayout";
import api from "../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onFinish = async (values: { email: string }) => {
    try {
      await api.post("/auth/forgot-password", values);
      message.success(t("auth.forgotPassword.success"));
    } catch (err: any) {
      message.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--login">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/images/brand/logo-teal.svg" alt="Sofron" />
        </div>

        <div className="auth-content">
          <PageLayout
            title={t("auth.forgotPassword.title")}
            subtitle={t("auth.forgotPassword.subtitle")}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                label={t("auth.email")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Button type="primary" htmlType="submit" className="auth-submit">
                {t("common.submit")}
              </Button>
            </Form>

            <div className="auth-footer">
              <Button type="link" onClick={() => navigate("/demo/login")}>
                {t("auth.backToLogin")}
              </Button>
            </div>
          </PageLayout>
        </div>
      </div>
    </div>
  );
}
