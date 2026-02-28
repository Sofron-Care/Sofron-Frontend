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
import api from "../../../../shared/api/axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../../auth/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: any; // if provided → edit mode
}

export default function ServiceModal({
  open,
  onClose,
  onSuccess,
  service,
}: Props) {
  const { t } = useTranslation();
  const { organization } = useAuth();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    string | number | null
  >(null);

  const isEditMode = !!service;
  const requiresServicePolicy =
    organization?.cancellationPolicyScope === "service";

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  useEffect(() => {
    if (!service || !open) return;
    const policy = service.cancellationPolicies?.[0];

    let formattedPolicy: any = undefined;

    if (policy) {
      let feeType = "none";
      let feeValue: number | undefined = undefined;

      if (policy.feePercentage != null) {
        feeType = "percentage";
        feeValue = Number(policy.feePercentage);
      } else if (policy.flatFee != null) {
        feeType = "flat";
        feeValue = Number(policy.flatFee);
      }

      formattedPolicy = {
        minHoursBefore: policy.minHoursBefore,
        feeType,
        feeValue,
      };
    }

    form.setFieldsValue({
      name: service.name,
      description: service.description,
      price: Number(service.price),
      duration: service.duration,
      category: service.categoryId || undefined,
      otherCategory: service.otherCategory,
      cancellationPolicy: formattedPolicy,
    });

    setSelectedCategory(service.categoryId ?? null);
  }, [service, open]);

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
        const policy = values.cancellationPolicy || {};
        const feeType = policy.feeType;

        const formattedPolicy: any = {
          minHoursBefore: policy.minHoursBefore,
        };

        if (feeType === "percentage") {
          formattedPolicy.feePercentage = policy.feeValue;
          formattedPolicy.flatFee = null;
        } else if (feeType === "flat") {
          formattedPolicy.flatFee = policy.feeValue;
          formattedPolicy.feePercentage = null;
        } else {
          formattedPolicy.feePercentage = null;
          formattedPolicy.flatFee = null;
        }

        payload.cancellationPolicy = formattedPolicy;
      }

      if (isEditMode) {
        await api.patch(`/services/${service.id}`, payload);
      } else {
        await api.post("/services", payload);
      }

      form.resetFields();
      setSelectedCategory(null);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditMode ? t("services.edit") : t("services.create")}
      open={open}
      onCancel={onClose}
      destroyOnHidden
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
    >
      <Form form={form} layout="vertical">
        {/* Name */}
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
                  {
                    label: t("services.form.other"),
                    value: "other",
                  },
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

        {/* Other Category */}
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

        {/* Cancellation Policy (Service-Level Only) */}
        {requiresServicePolicy && (
          <>
            <Divider />
            <h4>{t("services.form.cancellationPolicy")}</h4>

            <Row gutter={16}>
              {/* Min Hours */}
              <Col span={12}>
                <Form.Item
                  label={t("services.form.minHoursBefore")}
                  name={["cancellationPolicy", "minHoursBefore"]}
                  rules={[{ required: true }]}
                  labelCol={{ style: { whiteSpace: "nowrap" } }}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* Fee Type */}
              <Col span={12}>
                <Form.Item
                  label={t("services.form.feeType")}
                  name={["cancellationPolicy", "feeType"]}
                  initialValue="none"
                >
                  <Select
                    options={[
                      { label: t("services.form.none"), value: "none" },
                      {
                        label: t("services.form.feePercentage"),
                        value: "percentage",
                      },
                      { label: t("services.form.flatFee"), value: "flat" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const feeType = getFieldValue([
                  "cancellationPolicy",
                  "feeType",
                ]);

                if (!feeType || feeType === "none") return null;

                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={
                          feeType === "percentage"
                            ? t("services.form.feePercentage")
                            : t("services.form.flatFee")
                        }
                        name={["cancellationPolicy", "feeValue"]}
                        rules={[{ required: true }]}
                      >
                        <InputNumber
                          min={0}
                          max={feeType === "percentage" ? 100 : undefined}
                          style={{ width: "100%" }}
                          addonBefore={feeType === "flat" ? "$" : undefined}
                          addonAfter={
                            feeType === "percentage" ? "%" : undefined
                          }
                        />
                      </Form.Item>
                    </Col>

                    {/* keeps alignment clean */}
                    <Col span={12} />
                  </Row>
                );
              }}
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
}
