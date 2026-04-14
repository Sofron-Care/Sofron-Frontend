import { Drawer, Card, Button, Tag, Spin, message } from "antd";
import { useEffect, useState } from "react";
import axios from "../../../../shared/api/axios";
import FormSchemaRenderer from "./FormSchemaRenderer";

interface RequiredForm {
  templateId: string;
  title: string;
  alreadySubmitted: boolean;
  submissionId: string | null;
}

interface Props {
  open: boolean;
  appointmentId: string | null;
  forms: RequiredForm[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequiredFormsDrawer({
  open,
  appointmentId,
  forms,
  onClose,
  onSuccess,
}: Props) {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [schema, setSchema] = useState<any>(null);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     FETCH FORM SCHEMA
  ========================= */
  const fetchSchema = async (templateId: string) => {
    setLoadingSchema(true);
    try {
      const res = await axios.get(`/documents/templates/${templateId}`, {
        params: { appointmentId },
      });
      setSchema(res.data.data.template);
      setActiveForm(templateId);
    } catch {
      message.error("Failed to load form");
    } finally {
      setLoadingSchema(false);
    }
  };

  /* =========================
     SUBMIT
  ========================= */
const handleSubmit = async (values: any) => {
  if (!appointmentId || !activeForm) return;

  setSubmitting(true);

  try {
    await axios.post("/documents/client/submit", {
      appointmentId,
      documentTemplateId: activeForm,
      responses: values,
    });

    const remainingIncompleteForms = forms.filter(
      (form) =>
        form.templateId !== activeForm && !form.alreadySubmitted
    );

    setActiveForm(null);
    setSchema(null);

    onSuccess?.();

    if (remainingIncompleteForms.length === 0) {
      onClose();
    }
  } catch {
    console.error("Submit failed");
  } finally {
    setSubmitting(false);
  }
};

  /* =========================
     RESET ON CLOSE
  ========================= */
  useEffect(() => {
    if (!open) {
      setActiveForm(null);
      setSchema(null);
    }
  }, [open]);

  return (
    <Drawer title="Required Forms" open={open} onClose={onClose} size="large">
      {/* =========================
         LIST VIEW
      ========================= */}
      {!activeForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {forms.map((form) => (
            <Card key={form.templateId}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p>{form.title}</p>
                </div>

                {form.alreadySubmitted ? (
                  <Tag color="green">Completed</Tag>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => fetchSchema(form.templateId)}
                  >
                    Start
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* =========================
         FORM VIEW
      ========================= */}
      {activeForm && (
        <div>
          {loadingSchema ? (
            <Spin />
          ) : (
            <FormSchemaRenderer
              schema={schema}
              onSubmit={handleSubmit}
              submitting={submitting}
              onBack={() => {
                setActiveForm(null);
                setSchema(null);
              }}
            />
          )}
        </div>
      )}
    </Drawer>
  );
}
