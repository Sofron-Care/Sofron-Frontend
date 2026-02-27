import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Row,
  Col,
  Divider,
} from "antd";
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
        {/* Service Name */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t("services.form.name")}
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Category + Duration */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t("services.form.category")} name="category">
              <Select
                placeholder={t("services.form.selectCategory")}
                onChange={(value) => setSelectedCategory(value)}
                options={[
                  ...categories.map((cat) => ({
                    label: cat.title,
                    value: cat.id,
                  })),
                  { label: t("services.form.other"), value: "other" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={t("services.form.duration")}
              name="duration"
              rules={[{ required: true }]}
            >
              <InputNumber min={5} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Other Category (if needed) */}
        {selectedCategory === "other" && (
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={t("services.form.otherCategory")}
                name="otherCategory"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Price */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("services.form.price")}
              name="price"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Description */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label={t("services.form.description")}
              name="description"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        {organization?.cancellationPolicyScope === "service" && (
          <>
            <Divider />

            <h4>Cancellation Policy</h4>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Minimum Hours Before"
                  name={["cancellationPolicy", "minHoursBefore"]}
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Fee Type" name="feeType">
                  <Select
                    options={[
                      { label: "None", value: "none" },
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

                if (!feeType || feeType === "none") return null;

                return (
                  <Form.Item
                    label={
                      feeType === "percentage"
                        ? "Fee Percentage (%)"
                        : "Flat Fee"
                    }
                    name="feeValue"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      max={feeType === "percentage" ? 100 : undefined}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
