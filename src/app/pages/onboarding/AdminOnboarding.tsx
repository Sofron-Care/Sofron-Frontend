import { Form, Input, Button, Select, InputNumber, Row, Col } from "antd";
import api from "./../../../shared/api/axios";
import { useAuth } from "./../../../app/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminOnboarding() {
  const [form] = Form.useForm();
  const { user, setUser, setOrganization } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const payload: any = { ...values };

    if (payload.cancellationPolicyScope === "organization") {
      const feeType = payload.feeType;

      payload.feePercentage =
        feeType === "percentage" ? payload.feeValue : null;

      payload.flatFee = feeType === "flat" ? payload.feeValue : null;
    }

    // Remove frontend-only fields
    delete payload.feeType;
    delete payload.feeValue;

    const res = await api.post("/auth/onboarding/admin", payload);

    const orgIdFromResponse = res.data.data.organization.id;

    const updatedUser = {
      ...user!,
      onboardingCompleted: true,
      requiresOnboarding: false,
      organizationId: orgIdFromResponse,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const orgRes = await api.get("/organizations");
    setOrganization(orgRes.data.data.organizationDetails);

    navigate("/demo/app");
  };

  return (
    <div className="container section-tight">
      <div className="card onboarding-card">
        <h1>{t("onboarding.title")}</h1>

        <Form form={form} layout="vertical">
          {/* --- Organization Info --- */}
          <h2 style={{ marginBottom: 16 }}>
            {t("onboarding.sections.organizationDetails")}
          </h2>

          <Form.Item
            name="name"
            label={t("onboarding.fields.clinicName")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* 🔥 NEW: Business Type */}
          <Form.Item
            name="businessType"
            label={t("onboarding.businessType.label")}
            rules={[{ required: true }]}
            extra={t("onboarding.businessType.helper")}
          >
            <Select
              options={[
                {
                  label: t("businessTypes.physical_therapy"),
                  value: "physical_therapy",
                },
                {
                  label: t("businessTypes.chiropractic"),
                  value: "chiropractic",
                },
                {
                  label: t("businessTypes.massage_therapy"),
                  value: "massage_therapy",
                },
                {
                  label: t("businessTypes.personal_training"),
                  value: "personal_training",
                },
                {
                  label: t("businessTypes.recovery"),
                  value: "recovery",
                },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="EIN"
                label={t("onboarding.fields.ein")}
                rules={[
                  { required: true },
                  {
                    pattern: /^\d{2}-\d{7}$/,
                    message: t("onboarding.validation.ein"),
                  },
                ]}
                extra={t("onboarding.fields.einHelp")}
              >
                <Input
                  maxLength={10}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2) {
                      value = value.slice(0, 2) + "-" + value.slice(2, 9);
                    }
                    form.setFieldsValue({ EIN: value });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessEmail"
                label={t("onboarding.fields.businessEmail")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label={t("onboarding.fields.phone")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="streetAddress"
                label={t("onboarding.fields.streetAddress")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="suite" label={t("onboarding.fields.suite")}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                name="city"
                label={t("onboarding.fields.city")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="state"
                label={t("onboarding.fields.state")}
                rules={[{ required: true }]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="zipcode"
                label={t("onboarding.fields.zipcode")}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Scheduling Mode --- */}
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>
            {t("onboarding.sections.scheduling")}
          </h2>

          <Form.Item
            name="schedulingMode"
            label={t("onboarding.scheduling.label")}
            rules={[{ required: true }]}
            initialValue="organization"
            extra={t("onboarding.scheduling.description")}
          >
            <Select
              options={[
                {
                  label: t("onboarding.scheduling.organization"),
                  value: "organization",
                },
                {
                  label: t("onboarding.scheduling.specialist"),
                  value: "specialist",
                },
              ]}
            />
          </Form.Item>

          {/* --- Professional Info --- */}
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>
            {t("onboarding.sections.professional")}
          </h2>

          <Form.Item
            name="npiNumber"
            label={t("onboarding.fields.npi")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* --- Cancellation Policy --- */}
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>
            {t("onboarding.sections.cancellation")}
          </h2>

          <Form.Item
            name="cancellationPolicyScope"
            label={t("onboarding.cancellation.scope")}
            initialValue="organization"
          >
            <Select
              options={[
                {
                  label: t("onboarding.cancellation.organizationWide"),
                  value: "organization",
                },
                {
                  label: t("onboarding.cancellation.perService"),
                  value: "service",
                },
              ]}
            />
          </Form.Item>

          <Form.Item shouldUpdate>
            {({ getFieldValue }) =>
              getFieldValue("cancellationPolicyScope") === "organization" && (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="minHoursBefore"
                        label={t("onboarding.cancellation.minHours")}
                        rules={[{ required: true }]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="feeType"
                        label={t("onboarding.cancellation.feeType")}
                        initialValue="none"
                      >
                        <Select
                          options={[
                            {
                              label: t("onboarding.cancellation.noFee"),
                              value: "none",
                            },
                            {
                              label: t("onboarding.cancellation.percentage"),
                              value: "percentage",
                            },
                            {
                              label: t("onboarding.cancellation.flat"),
                              value: "flat",
                            },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item shouldUpdate>
                    {({ getFieldValue }) => {
                      const feeType = getFieldValue("feeType");

                      if (feeType === "percentage") {
                        return (
                          <Form.Item
                            name="feeValue"
                            label={t("onboarding.cancellation.feePercentage")}
                            rules={[{ required: true }]}
                          >
                            <InputNumber
                              min={0}
                              max={100}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        );
                      }

                      if (feeType === "flat") {
                        return (
                          <Form.Item
                            name="feeValue"
                            label={t("onboarding.cancellation.flatFee")}
                            rules={[{ required: true }]}
                          >
                            <InputNumber min={0} style={{ width: "100%" }} />
                          </Form.Item>
                        );
                      }

                      return null;
                    }}
                  </Form.Item>
                </>
              )
            }
          </Form.Item>

          <Button type="primary" onClick={handleSubmit}>
            {t("onboarding.actions.complete")}
          </Button>
        </Form>
      </div>
    </div>
  );
}
