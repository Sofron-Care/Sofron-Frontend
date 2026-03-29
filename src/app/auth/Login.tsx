import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, loading } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const user = await login(values.email, values.password);

      if (user.role !== "client" && user.orgAccessActive === false) {
        message.warning(t("auth.login.orgInactive"));
        navigate("/demo/client");
        return;
      }

      navigate("/demo/app");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t("auth.login.loginFailed"),
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7f9",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/images/brand/logo-teal.svg" alt="Sofron" height={36} />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          {t("auth.login.title")}
        </Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label={t("auth.login.email")}
            name="email"
            rules={[
              {
                required: true,
                message: t("auth.login.requiredEmail"),
              },
              {
                type: "email",
                message: t("auth.login.invalidEmail"),
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.login.password")}
            name="password"
            rules={[
              {
                required: true,
                message: t("auth.login.requiredPassword"),
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{ marginTop: 8 }}
          >
            {t("auth.login.submit")}
          </Button>
        </Form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Text>
            {t("auth.login.noAccount")}{" "}
            <a onClick={() => navigate("/demo/register/client")}>
              {t("auth.login.signUp")}
            </a>
          </Text>
        </div>

        <div style={{ marginTop: 8, textAlign: "center" }}>
          <a onClick={() => navigate("/demo/register/clinic")}>
            {t("auth.login.registerClinic")}
          </a>
        </div>
      </Card>
    </div>
  );
}
