import { Form, Input, Button, message, Drawer, Typography, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import axios from "../../../../shared/api/axios";
import DocumentBuilder from "./DocumentBuilder";
import { useAuth } from "../../../auth/AuthContext";
import type { DocumentSchema } from "../Documents";

const { Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDocumentModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [form] = Form.useForm();

  const [schema, setSchema] = useState<DocumentSchema>({ fields: [] });
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const res = await axios.get("/services");
      setServices(res.data.data.services);
    };

    fetchServices();
  }, []);

  const handleClose = () => {
    form.resetFields();
    setSchema({ fields: [] });
    onClose();
  };

  const handleSubmit = async () => {
    try {
      if (!user?.id) return;

      const values = await form.validateFields();
      setLoading(true);

      await axios.post("/documents/templates", {
        title: values.title,
        description: values.description,
        schema,
        createdBy: user.id,
        serviceIds: values.serviceIds || [],
      });

      message.success(t("documents.messages.created"));

      form.resetFields();
      setSchema({ fields: [] });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      title={t("documents.create")}
      onClose={handleClose}
      width="100%"
      className="document-drawer"
    >
      <div className="document-drawer__content">
        <Form layout="vertical" form={form}>
          <Form.Item
            name="title"
            label={t("documents.form.title")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={t("documents.form.description")}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label={t("documents.form.services")} name="serviceIds">
            <Select
              mode="multiple"
              options={services.map((s: any) => ({
                label: s.name,
                value: s.id,
              }))}
            />
          </Form.Item>

          <Text strong className="document-drawer__section-title">
            {t("documents.builder.title")}
          </Text>

          <DocumentBuilder schema={schema} setSchema={setSchema} />
        </Form>
      </div>

      <div className="document-drawer__footer">
        <Button onClick={handleClose}>{t("common.cancel")}</Button>
        <Button type="primary" loading={loading} onClick={handleSubmit}>
          {t("common.save")}
        </Button>
      </div>
    </Drawer>
  );
}
