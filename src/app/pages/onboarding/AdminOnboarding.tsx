import { Form, Input, Button, Select, InputNumber, Row, Col } from "antd";
import api from "./../../../shared/api/axios";
import { useAuth } from "./../../../app/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminOnboarding() {
  const [form] = Form.useForm();
  const { user, setUser, setOrganization } = useAuth();
  const navigate = useNavigate();

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
        <h1>Complete Clinic Setup</h1>

        <Form form={form} layout="vertical">
          {/* --- Organization Info --- */}
          <h2 style={{ marginBottom: 16 }}>Organization Details</h2>

          <Form.Item
            name="name"
            label="Clinic Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessEmail"
                label="Business Email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="EIN"
                label="EIN"
                rules={[
                  { required: true },
                  {
                    pattern: /^\d{2}-\d{7}$/,
                    message: "EIN must be in format XX-XXXXXXX",
                  },
                ]}
                extra="Format: 12-3456789"
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
                label="Business Email"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Business Phone"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="streetAddress"
            label="Street Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="streetAddress"
                label="Street Address"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="suite" label="Suite / Unit">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true }]}
              >
                <Input maxLength={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="zipcode"
                label="Zipcode"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Professional Info --- */}
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>
            Professional Details
          </h2>

          <Form.Item
            name="npiNumber"
            label="NPI Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* --- Cancellation Policy --- */}
          <h2 style={{ marginTop: 32, marginBottom: 16 }}>
            Cancellation Policy
          </h2>

          <Form.Item
            name="cancellationPolicyScope"
            label="Policy Scope"
            initialValue="organization"
          >
            <Select
              options={[
                { label: "Organization Wide", value: "organization" },
                { label: "Per Service", value: "service" },
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
                        label="Minimum Hours Before"
                        rules={[{ required: true }]}
                      >
                        <InputNumber min={0} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="feeType"
                        label="Fee Type"
                        initialValue="none"
                      >
                        <Select
                          options={[
                            { label: "No Fee", value: "none" },
                            { label: "Percentage", value: "percentage" },
                            { label: "Flat Fee", value: "flat" },
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
                            label="Fee Percentage (%)"
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
                            label="Flat Fee"
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
            Complete Setup
          </Button>
        </Form>
      </div>
    </div>
  );
}
