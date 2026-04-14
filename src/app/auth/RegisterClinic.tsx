import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/axios";

const { Title, Text } = Typography;

type ClinicAccountType = "clinic" | "freelance";

export default function RegisterClinic() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const tosVersion = "1.0.0";

  const onFinish = async (values: any) => {
    const role =
      values.accountType === "freelance" ? "freelanceAdmin" : "clinicAdmin";

    if (values.password !== values.passwordConfirm) {
      message.error(t("auth.clinicRegister.passwordsNoMatch"));
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
        role,
        tosVersion,
      });

      message.success(t("auth.clinicRegister.success"));
      navigate("/demo/login");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
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
      <Card style={{ width: 460, borderRadius: 12 }}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <img src="/images/brand/logo-teal.svg" alt="Sofron" height={36} />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 8 }}>
          {t("auth.clinicRegister.title")}
        </Title>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {t("auth.clinicRegister.subtitle")}
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ accountType: "clinic" as ClinicAccountType }}
        >
          <Form.Item
            label={t("auth.clinicRegister.accountTypeLabel")}
            name="accountType"
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
            ]}
          >
            <Radio.Group>
              <Radio value="clinic">
                {t("auth.clinicRegister.accountTypeClinic")}
              </Radio>
              <Radio value="freelance">
                {t("auth.clinicRegister.accountTypeFreelance")}
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={t("auth.clinicRegister.firstName")}
            name="firstName"
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clinicRegister.lastName")}
            name="lastName"
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clinicRegister.email")}
            name="email"
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
              { type: "email", message: t("auth.clinicRegister.invalidEmail") },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clinicRegister.password")}
            name="password"
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label={t("auth.clinicRegister.passwordConfirm")}
            name="passwordConfirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("auth.clinicRegister.required") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(
                    new Error(t("auth.clinicRegister.passwordsNoMatch")),
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
                        new Error(t("auth.clinicRegister.tosRequired")),
                      ),
              },
            ]}
          >
            <Checkbox>{t("auth.clinicRegister.tosLabel")}</Checkbox>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            {t("auth.clinicRegister.submit")}
          </Button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Text>
              {t("auth.clinicRegister.alreadyHave")}{" "}
              <a onClick={() => navigate("/demo/login")}>
                {t("auth.clinicRegister.login")}
              </a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
