import { useState } from "react";
import { Button, Input, Form, Select, message } from "antd";
import { useTranslation } from "react-i18next";
import { postInterest } from "../../lib/api";

const { Option } = Select;

export default function InterestForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const usage = Form.useWatch("usage", form); // 👈 watch usage

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const res = await postInterest(values);

      message.success(res.message || t("interest.messages.success"));
      onSuccess?.();
    } catch (error: any) {
      message.error(error.message || t("interest.messages.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="form-row">
        <Form.Item name="firstName" rules={[{ required: true }]}>
          <Input placeholder={t("interest.form.firstName")} />
        </Form.Item>

        <Form.Item name="lastName" rules={[{ required: true }]}>
          <Input placeholder={t("interest.form.lastName")} />
        </Form.Item>
      </div>

      <Form.Item name="email" rules={[{ required: true }, { type: "email" }]}>
        <Input placeholder={t("interest.form.email")} />
      </Form.Item>

      <div className="form-row">
        <Form.Item name="usage" rules={[{ required: true }]}>
          <Select placeholder={t("interest.form.usagePlaceholder")}>
            <Option value="Client">{t("interest.usageOptions.client")}</Option>
            <Option value="Freelance Specialist">
              {t("interest.usageOptions.freelance")}
            </Option>
            <Option value="Clinic">{t("interest.usageOptions.clinic")}</Option>
          </Select>
        </Form.Item>

        {/* 👇 Conditional Field */}
        {usage !== "Client" && (
          <Form.Item name="clinicName">
            <Input placeholder={t("interest.form.clinicName")} />
          </Form.Item>
        )}
      </div>

      <Form.Item name="feedback">
        <Input.TextArea rows={3} placeholder={t("interest.form.feedback")} />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        {t("interest.form.submit")}
      </Button>
    </Form>
  );
}
