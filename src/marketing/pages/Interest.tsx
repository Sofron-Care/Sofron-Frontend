import { useState } from "react";
import { Button, Input, Form, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import MarketingLayout from "../components/MarketingLayout";
import { postInterest } from "../../lib/api";

const { Option } = Select;

export default function Interest() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const res = await postInterest(values);

      message.success(res.message || t("interest.messages.success"));
      setSubmitted(true);
    } catch (error: any) {
      message.error(error.message || t("interest.messages.error"));
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <MarketingLayout>
        <section className="section">
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100%", maxWidth: 720 }}>
              <div
                className="card"
                style={{
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <h2>{t("interest.success.headline")}</h2>
                <p style={{ marginTop: 16 }}>{t("interest.success.message")}</p>
              </div>
            </div>
          </div>
        </section>
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout>
      <section className="section">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 720 }}>
            {/* Hero */}
            <div style={{ textAlign: "center" }}>
              <h1>{t("interest.hero.headline")}</h1>
              <p style={{ marginTop: 12 }}>{t("interest.hero.subtext")}</p>
            </div>

            {/* Form Card */}
            <div
              className="card"
              style={{
                marginTop: 40,
                padding: 28,
              }}
            >
              <Form layout="vertical" onFinish={onFinish}>
                <div className="form-row">
                  <Form.Item
                    label={t("interest.form.firstName")}
                    name="firstName"
                    rules={[
                      { required: true, message: t("validation.required") },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label={t("interest.form.lastName")}
                    name="lastName"
                    rules={[
                      { required: true, message: t("validation.required") },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item
                  label={t("interest.form.email")}
                  name="email"
                  rules={[
                    { required: true, message: t("validation.required") },
                    { type: "email", message: t("validation.email") },
                  ]}
                >
                  <Input />
                </Form.Item>

                <div className="form-row">
                  <Form.Item
                    label={t("interest.form.usage")}
                    name="usage"
                    rules={[
                      { required: true, message: t("validation.required") },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Select placeholder={t("interest.form.usagePlaceholder")}>
                      <Option value="Client">
                        {t("interest.usageOptions.client")}
                      </Option>
                      <Option value="Freelance Specialist">
                        {t("interest.usageOptions.freelance")}
                      </Option>
                      <Option value="Clinic">
                        {t("interest.usageOptions.clinic")}
                      </Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={t("interest.form.clinicName")}
                    name="clinicName"
                    style={{ flex: 1 }}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item label={t("interest.form.feedback")} name="feedback">
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  {t("interest.form.submit")}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
