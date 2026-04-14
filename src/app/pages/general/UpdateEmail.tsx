import { Form, Input, Button, message } from "antd";
import PageLayout from "../../layout/PageLayout";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../shared/api/axios";
import { useTranslation } from "react-i18next";

export default function UpdateEmail() {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = async (values: { newEmail: string }) => {
    try {
      await api.patch(`/auth/update-email?token=${token}`, values);

      message.success(t("auth.updateEmail.success"));

      // optional redirect
      setTimeout(() => navigate("/demo/login"), 1500);
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
            title={t("auth.updateEmail.title")}
            subtitle={t("auth.updateEmail.subtitle")}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="newEmail"
                label={t("auth.email")}
                rules={[{ required: true, type: "email" }]}
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
