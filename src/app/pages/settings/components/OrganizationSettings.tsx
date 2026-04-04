import {
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Divider,
  Card,
  InputNumber,
  Modal,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "./../../../../shared/api/axios";
import { useAuth } from "./../../../auth/AuthContext";

const { Title, Text } = Typography;

export default function OrganizationSettings() {
  const { t } = useTranslation();
  const { organization, setOrganization, setUser } = useAuth();

  const [form] = Form.useForm();
  const [policyForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  // 👇 watch fee type
  const feeType = Form.useWatch("feeType", policyForm);

  useEffect(() => {
    if (organization) {
      form.setFieldsValue(organization);
    }

    fetchPolicy();
  }, [organization]);

  const fetchPolicy = async () => {
    setPolicyLoading(true);
    try {
      const res = await api.get("/organizations/cancellation-policy");
      const policy = res.data.data.policy;

      if (policy) {
        policyForm.setFieldsValue({
          ...policy,
          feeType: policy.feePercentage ? "percentage" : "flat",
        });
      } else {
        // default state
        policyForm.setFieldsValue({
          feeType: "flat",
        });
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setPolicyLoading(false);
    }
  };

  const handleSaveOrg = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.patch("/organizations", values);

      const updatedOrg = res.data.data.updatedOrganization;

      setOrganization(updatedOrg);

      message.success(t("common.saved"));
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = async (values: any) => {
    setSavingPolicy(true);

    const payload = {
      minHoursBefore: values.minHoursBefore,
      feePercentage:
        values.feeType === "percentage" ? values.feePercentage : null,
      flatFee: values.feeType === "flat" ? values.flatFee : null,
    };

    try {
      await api.post("/organizations/cancellation-policy", payload);

      message.success(t("common.saved"));
    } catch (err: any) {
      message.error(err?.response?.data?.message || t("common.error"));
    } finally {
      setSavingPolicy(false);
    }
  };

  const handleDeactivate = () => {
    Modal.confirm({
      title: t("settings.confirmDeactivateTitle"),
      content: t("settings.deactivateWarning"),
      okText: t("settings.confirmDeactivate"),
      okButtonProps: { danger: true },
      cancelText: t("common.cancel"),
      onOk: async () => {
        setDeactivating(true);
        try {
          await api.patch("/organizations/deactivate");

          message.success(t("settings.orgDeactivated"));

          handlePostDeactivate();
        } catch (err: any) {
          message.error(err?.response?.data?.message || t("common.error"));
        } finally {
          setDeactivating(false);
        }
      },
    });
  };

  const handlePostDeactivate = () => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            orgAccessActive: false,
          }
        : prev,
    );
  };

  if (!organization) return null;

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      {/* ================= ORG INFO ================= */}
      <div>
        <Title level={5}>{t("settings.orgInfo")}</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveOrg}
          disabled={policyLoading}
        >
          <Form.Item
            label={t("settings.orgName")}
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.businessEmail")} name="businessEmail">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.phone")} name="phone">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.website")} name="website">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.logoUrl")} name="logoUrl">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.streetAddress")} name="streetAddress">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.city")} name="city">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.state")} name="state">
            <Input />
          </Form.Item>

          <Form.Item label={t("settings.zipcode")} name="zipcode">
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            {t("common.save")}
          </Button>
        </Form>
      </div>

      <Divider />

      {/* ================= CANCELLATION POLICY ================= */}
      <div>
        <Title level={5}>{t("settings.cancellationPolicy")}</Title>

        <Form
          form={policyForm}
          layout="vertical"
          onFinish={handleSavePolicy}
        >
          <Form.Item
            label={t("settings.minHours")}
            name="minHoursBefore"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          {/* 🔥 Fee Type Toggle */}
          <Form.Item
            label="Fee Type"
            name="feeType"
            initialValue="flat"
            rules={[{ required: true }]}
          >
            <Space>
              <Button
                type={feeType === "flat" ? "primary" : "default"}
                onClick={() =>
                  policyForm.setFieldsValue({ feeType: "flat" })
                }
              >
                Flat Fee
              </Button>
              <Button
                type={feeType === "percentage" ? "primary" : "default"}
                onClick={() =>
                  policyForm.setFieldsValue({ feeType: "percentage" })
                }
              >
                Percentage
              </Button>
            </Space>
          </Form.Item>

          {/* 🔄 Conditional Inputs */}
          {feeType === "percentage" && (
            <Form.Item
              label={t("settings.feePercentage")}
              name="feePercentage"
              rules={[{ required: true }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
              />
            </Form.Item>
          )}

          {feeType === "flat" && (
            <Form.Item
              label={t("settings.flatFee")}
              name="flatFee"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          )}

          <Button type="primary" htmlType="submit" loading={savingPolicy}>
            {t("common.save")}
          </Button>
        </Form>
      </div>

      <Divider />

      {/* ================= DANGER ZONE ================= */}
      <Card>
        <Title level={5} type="danger">
          {t("settings.dangerZone")}
        </Title>

        <Text type="secondary">{t("settings.deactivateWarning")}</Text>

        <div style={{ marginTop: 16 }}>
          <Button danger onClick={handleDeactivate} loading={deactivating}>
            {t("settings.deactivateOrg")}
          </Button>
        </div>
      </Card>
    </Space>
  );
}