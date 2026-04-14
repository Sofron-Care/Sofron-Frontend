import { Button, Space, Card, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import DocumentFieldEditor from "./DocumentFieldEditor";
import type { DocumentSchema, DocumentField } from "../Documents";

const { Text } = Typography;

interface Props {
  schema: DocumentSchema;
  setSchema: React.Dispatch<React.SetStateAction<DocumentSchema>>;
}

export default function DocumentBuilder({ schema, setSchema }: Props) {
  const { t } = useTranslation();

  const addField = (type: DocumentField["type"]) => {
    const newField: DocumentField = {
      id: uuidv4(),
      type,
      label: "",
      required: false,
      options: type === "select" ? [] : undefined,
    };

    setSchema({
      ...schema,
      fields: [...(schema.fields ?? []), newField],
    });
  };

  const updateField = (id: string, updatedField: DocumentField) => {
    setSchema({
      ...schema,
      fields: (schema.fields ?? []).map((field) =>
        field.id === id ? updatedField : field,
      ),
    });
  };

  const removeField = (id: string) => {
    setSchema({
      ...schema,
      fields: (schema.fields ?? []).filter((field) => field.id !== id),
    });
  };

  return (
    <div className="document-builder">
      <Space className="document-builder__actions">
        <Button onClick={() => addField("text")}>
          {t("documents.builder.text")}
        </Button>
        <Button onClick={() => addField("textarea")}>
          {t("documents.builder.textarea")}
        </Button>
        <Button onClick={() => addField("select")}>
          {t("documents.builder.select")}
        </Button>
        <Button onClick={() => addField("checkbox")}>
          {t("documents.builder.checkbox")}
        </Button>
      </Space>

      {(schema.fields ?? []).length === 0 && (
        <div className="document-builder__empty">
          <Text type="secondary">{t("documents.builder.empty")}</Text>
        </div>
      )}

      <Space orientation="vertical" className="document-builder__fields">
        {(schema.fields ?? []).map((field) => (
          <Card key={field.id}>
            <DocumentFieldEditor
              field={field}
              onChange={(updated: DocumentField) =>
                updateField(field.id, updated)
              }
              onRemove={() => removeField(field.id)}
            />
          </Card>
        ))}
      </Space>
    </div>
  );
}
