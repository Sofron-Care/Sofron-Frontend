import { Form, Input, Button, message } from "antd";
import PageLayout from "../../layout/PageLayout";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../shared/api/axios";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      await api.patch(`/auth/reset-password?token=${token}`, {
        password: values.password,
      });

      message.success(t("auth.resetPassword.success"));

      // optional but recommended
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
            title={t("auth.resetPassword.title")}
            subtitle={t("auth.resetPassword.subtitle")}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="password"
                label={t("auth.password")}
                rules={[{ required: true }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={t("auth.confirmPassword")}
                dependencies={["password"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t("auth.passwordsDoNotMatch")),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
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
