import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "../../layout/PageLayout";
import DocumentsTable from "./components/DocumentsTable";
import axios from "./../../../shared/api/axios";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";
import { Button } from "antd";
import CreateDocumentModal from "./components/CreateDocumentModal";
import EditDocumentModal from "./components/EditDocumentModal";

export type DocumentField = {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox";
  label: string;
  required?: boolean;
  options?: string[];
};

export type DocumentSchema = {
  fields: DocumentField[];
};

export type DocumentTemplate = {
  id: number;
  organizationId: number;
  title: string;
  description: string | null;
  schema: DocumentSchema;
  createdBy: number;
  isActive: boolean;
  serviceMappings?: {
    serviceId: number;
    service?: {
      id: number;
      name: string;
    };
  }[];
};

export default function Documents() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<DocumentTemplate | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/documents/templates/organization/me");
      setTemplates(res.data.data.templates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <PageLayout
      title={t("documents.title")}
      subtitle={t("documents.subtitle")}
      primaryAction={
        user && can(user.role, "create:document") ? (
          <Button type="primary" onClick={() => setCreateModalOpen(true)}>
            {t("documents.create")}
          </Button>
        ) : null
      }
    >
      <DocumentsTable
        data={templates}
        loading={loading}
        onRefresh={fetchTemplates}
        onEdit={(template: DocumentTemplate) => setEditingTemplate(template)}
      />

      <CreateDocumentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchTemplates}
      />

      <EditDocumentModal
        open={!!editingTemplate}
        template={editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSuccess={() => {
          fetchTemplates();
          setEditingTemplate(null);
        }}
      />
    </PageLayout>
  );
}
