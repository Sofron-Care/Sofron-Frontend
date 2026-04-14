import { Form, Input, Button } from "antd";

interface FormSchemaRendererProps {
  schema: any;
  onSubmit?: (values: Record<string, any>) => void;
  submitting?: boolean;
  initialValues?: Record<string, any>;
  readOnly?: boolean;
  onBack?: () => void;
}

const renderField = (component: any, readOnly = false) => {
  const rules = component.validate?.required
    ? [
        {
          required: true,
          message: `${component.label} is required`,
        },
      ]
    : [];

  if (readOnly) {
    return (
      <Form.Item key={component.key} label={component.label}>
        <div style={{ padding: "4px 0" }}>
          {component.value || component.defaultValue || "-"}
        </div>
      </Form.Item>
    );
  }

  switch (component.type) {
    case "textfield":
    case "email":
      return (
        <Form.Item key={component.key} name={component.key} label={component.label} rules={rules}>
          <Input />
        </Form.Item>
      );

    case "textarea":
      return (
        <Form.Item key={component.key} name={component.key} label={component.label} rules={rules}>
          <Input.TextArea rows={3} />
        </Form.Item>
      );

    default:
      return null;
  }
};

const renderComponents = (
  components: any[],
  readOnly: boolean,
  initialValues?: Record<string, any>
): React.ReactNode[] => {
  return components.map((component) => {
    if (component.type === "panel" && component.components) {
      return (
        <div key={component.key} className="required-forms-drawer__panel">
          <h3 className="required-forms-drawer__panel-title">
            {component.title}
          </h3>

          <div className="required-forms-drawer__panel-fields">
            {renderComponents(component.components, readOnly, initialValues)}
          </div>
        </div>
      );
    }

    if (!component.input) return null;

    const fieldWithValue = {
      ...component,
      value: initialValues?.[component.key],
    };

    return renderField(fieldWithValue, readOnly);
  });
};

export default function FormSchemaRenderer({
  schema,
  onSubmit,
  submitting = false,
  initialValues,
  readOnly = false,
  onBack,
}: FormSchemaRendererProps) {
  const components = Array.isArray(schema)
    ? schema
    : schema?.components || [];

  return (
    <Form
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      disabled={readOnly}
    >
      {/* Optional title */}
      {!Array.isArray(schema) && schema?.title && (
        <h2 style={{ marginBottom: 16 }}>{schema.title}</h2>
      )}

      {renderComponents(components, readOnly, initialValues)}

      <div className="required-forms-drawer__actions">
        {onBack && <Button onClick={onBack}>Back</Button>}

        {!readOnly && onSubmit && (
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        )}
      </div>
    </Form>
  );
}