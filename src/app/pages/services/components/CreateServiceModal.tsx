import { Modal, Form, Input, InputNumber, Button, Select } from "antd";
import { useTranslation } from "react-i18next";
import api from "./../../../../shared/api/axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateServiceModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    string | number | null
  >(null);

  const { organization } = useAuth();

  const requiresServicePolicy =
    organization?.cancellationPolicyScope === "service";

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const fetchCategories = async () => {
    const res = await api.get("/services/categories");
    setCategories(res.data.data.categories);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const payload: any = {
        name: values.name,
        description: values.description,
        price: values.price,
        duration: values.duration,
      };

      if (selectedCategory && selectedCategory !== "other") {
        payload.categoryId = selectedCategory;
      }

      if (selectedCategory === "other") {
        payload.otherCategory = values.otherCategory;
      }

      if (requiresServicePolicy) {
        payload.cancellationPolicy = values.cancellationPolicy;
      }

      await api.post("/services", payload);

      form.resetFields();
      setSelectedCategory(null);
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("services.create")}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {t("common.save")}
        </Button>,
      ]}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={t("services.form.name")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={t("services.form.category")} name="category">
          <Select
            placeholder={t("services.form.selectCategory")}
            onChange={(value) => setSelectedCategory(value)}
            options={[
              ...categories.map((cat) => ({
                label: cat.title,
                value: cat.id,
              })),
              {
                label: t("services.form.other"),
                value: "other",
              },
            ]}
          />
        </Form.Item>
        {selectedCategory === "other" && (
          <Form.Item
            label={t("services.form.otherCategory")}
            name="otherCategory"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item label={t("services.form.description")} name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label={t("services.form.price")}
          name="price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={t("services.form.duration")}
          name="duration"
          rules={[{ required: true }]}
        >
          <InputNumber min={5} style={{ width: "100%" }} />
        </Form.Item>
        {requiresServicePolicy && (
          <div className="service-policy-section">
            <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 600 }}>
              {t("services.form.cancellationPolicy")}
            </div>

            <Form.Item
              label={t("services.form.minHoursBefore")}
              name={["cancellationPolicy", "minHoursBefore"]}
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t("services.form.feePercentage")}
              name={["cancellationPolicy", "feePercentage"]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label={t("services.form.flatFee")}
              name={["cancellationPolicy", "flatFee"]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
        )}
      </Form>
    </Modal>
  );
}
