import {
  Modal,
  Button,
  DatePicker,
  TimePicker,
  Select,
  Input,
  message,
} from "antd";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OverrideModal({ open, onClose, onSave }: Props) {
  const [date, setDate] = useState<any>(null);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [type, setType] = useState<"available" | "unavailable">("unavailable");
  const [reason, setReason] = useState("");

  const handleSave = () => {
    if (!date || !start || !end) {
      message.error("Date and time range are required.");
      return;
    }

    if (start.isAfter(end) || start.isSame(end)) {
      message.error("Start time must be before end time.");
      return;
    }

    onSave({
      date: date.format("YYYY-MM-DD"),
      startTime: start.format("HH:mm"),
      endTime: end.format("HH:mm"),
      type,
      reason,
    });
  };

  return (
    <Modal
      title="Create Override"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <DatePicker value={date} onChange={setDate} />

        <div style={{ display: "flex", gap: 8 }}>
          <TimePicker value={start} onChange={setStart} format="HH:mm" />
          <TimePicker value={end} onChange={setEnd} format="HH:mm" />
        </div>

        <Select value={type} onChange={setType}>
          <Select.Option value="unavailable">Unavailable</Select.Option>
          <Select.Option value="available">Available</Select.Option>
        </Select>

        <Input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
    </Modal>
  );
}
