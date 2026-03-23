import { Form, Input, Button } from "antd";
import api from "./../../../shared/api/axios";
import { useAuth } from "./../../../app/auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EmployeeOnboarding() {
  const [form] = Form.useForm();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    await api.post("/auth/onboarding/employee", values);

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
          <Form.Item
            name="npiNumber"
            label="NPI Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="licenseNumber" label="License Number">
            <Input />
          </Form.Item>

          <Form.Item name="licenseState" label="License State">
            <Input maxLength={2} />
          </Form.Item>

          <Form.Item
            name="specializations"
            label="Specializations (comma separated)"
          >
            <Input />
          </Form.Item>

          <Button type="primary" onClick={handleSubmit}>
            Complete Setup
          </Button>
        </Form>
      </div>
    </div>
  );
}
