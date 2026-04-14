import { Modal, Form, Input, Select, Button, message, Row, Col } from "antd";
import { useState } from "react";
import axios from "./../../../../shared/api/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteEmployeeModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.post("/organizations/create-employee", values);
      console.log("ON SUCCESS CALLED");
      message.success("Invitation email sent.");
      onSuccess();
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Invite Employee"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
        >
          Send Invite
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="specialist">Specialist</Select.Option>
                <Select.Option value="frontDesk">Front Desk</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
