import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/axios";

const { Title, Text } = Typography;

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  tosAccepted: boolean;
}

export default function RegisterClient() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const tosVersion = "1.0.0";

  const onFinish = async (values: FormValues) => {
    if (values.password !== values.passwordConfirm) {
      message.error(t("auth.clientRegister.passwordsNoMatch"));
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        role: "client", // 🔥 KEY DIFFERENCE
        tosVersion,
      });

      message.success(t("auth.clientRegister.success"));
      navigate("/demo/login");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-logo">
          <img src="/images/brand/logo-teal.svg" alt="Sofron" />
        </div>

        <Title level={3} className="auth-title">
          {t("auth.clientRegister.title")}
        </Title>

        <Text className="auth-subtitle">
          {t("auth.clientRegister.subtitle")}
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("auth.clientRegister.firstName")}
            name="firstName"
            rules={[
              { required: true, message: t("auth.clientRegister.required") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clientRegister.lastName")}
            name="lastName"
            rules={[
              { required: true, message: t("auth.clientRegister.required") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clientRegister.email")}
            name="email"
            rules={[
              { required: true, message: t("auth.clientRegister.required") },
              { type: "email", message: t("auth.clientRegister.invalidEmail") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clientRegister.password")}
            name="password"
            rules={[
              { required: true, message: t("auth.clientRegister.required") },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clientRegister.passwordConfirm")}
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("auth.clientRegister.required") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(
                    new Error(t("auth.clientRegister.passwordsNoMatch"))
                  );
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="tosAccepted"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(t("auth.clientRegister.tosRequired"))
                      ),
              },
            ]}
          >
            <Checkbox>{t("auth.clientRegister.tosLabel")}</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            {t("auth.clientRegister.submit")}
          </Button>

          <div className="auth-footer">
            <Text>
              {t("auth.clientRegister.alreadyHave")}{" "}
              <a onClick={() => navigate("/demo/login")}>
                {t("auth.clientRegister.login")}
              </a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}