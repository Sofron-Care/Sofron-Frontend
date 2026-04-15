import { Modal, Button } from "antd";

type DemoMode = "guided" | "free";
type DemoRole = "clinicAdmin" | "client";

interface DemoEntryModalProps {
  open: boolean;
  onSelect: (mode: DemoMode, role: DemoRole) => void;
}

export default function DemoEntryModal({
  open,
  onSelect,
}: DemoEntryModalProps) {
  return (
    <Modal open={open} footer={null} closable={false} centered>
      <h2>Explore Sofron</h2>
      <p>No signup required — jump right in.</p>
      <p className="subtitle">Please Note: when selecting demo type please allow a few seconds for demo to launch.</p>

      <div style={{ marginTop: 20 }}>
        <h4>Guided Demo</h4>
        <Button
          block
          style={{ marginBottom: 10 }}
          onClick={() => onSelect("guided", "clinicAdmin")}
        >
          Clinic Admin
        </Button>

        <Button block onClick={() => onSelect("guided", "client")}>
          Client
        </Button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>Free Explore</h4>
        <Button
          block
          style={{ marginBottom: 10 }}
          onClick={() => onSelect("free", "clinicAdmin")}
        >
          Clinic Admin
        </Button>

        <Button block onClick={() => onSelect("free", "client")}>
          Client
        </Button>
      </div>
    </Modal>
  );
}
