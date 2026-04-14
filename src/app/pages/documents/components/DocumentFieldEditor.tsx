import { Input, Checkbox, Button, Space } from "antd";

export default function DocumentFieldEditor({
  field,
  onChange,
  onRemove,
}: any) {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Input
        placeholder="Field Label"
        value={field.label}
        onChange={(e) => onChange({ ...field, label: e.target.value })}
      />

      <Checkbox
        checked={field.required}
        onChange={(e) => onChange({ ...field, required: e.target.checked })}
      >
        Required
      </Checkbox>

      {field.type === "select" && (
        <Input
          placeholder="Comma separated options"
          value={field.options?.join(",")}
          onChange={(e) =>
            onChange({
              ...field,
              options: e.target.value.split(","),
            })
          }
        />
      )}

      <Button danger onClick={onRemove}>
        Remove
      </Button>
    </Space>
  );
}
