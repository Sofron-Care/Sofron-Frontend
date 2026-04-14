import { Form, Input, Button, DatePicker, Select, Row, Col } from "antd";
import api from "./../../../shared/api/axios";
import { useAuth } from "./../../../app/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ClientOnboarding() {
  const [form] = Form.useForm();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    await api.post("/auth/onboarding/client", values);

    const updatedUser = {
      ...user!,
      onboardingCompleted: true,
      requiresOnboarding: false,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    navigate("/demo/app");
  };

  return (
    <div className="container section-tight">
      <div className="card onboarding-card">
        <h1>Complete Your Profile</h1>

        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gender" label="Gender">
                <Select
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="occupation" label="Occupation">
            <Input />
          </Form.Item>

          <Form.Item
            name="preferredCommunication"
            label="Preferred Communication"
          >
            <Select
              options={[
                { label: "Email", value: "email" },
                { label: "Phone", value: "phone" },
                { label: "Text", value: "text" },
              ]}
            />
          </Form.Item>

          {/* Address */}
          <h3 style={{ marginTop: 24 }}>Address</h3>

          <Form.Item name="streetAddress" label="Street Address">
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="city" label="City">
                <Input />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="state" label="State">
                <Input maxLength={2} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="zipcode" label="Zipcode">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Notes */}
          <Form.Item name="medicalNotes" label="Medical Notes">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Button type="primary" onClick={handleSubmit}>
            Complete Setup
          </Button>
        </Form>
      </div>
    </div>
  );
}
