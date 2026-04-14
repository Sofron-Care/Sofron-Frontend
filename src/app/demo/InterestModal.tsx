import { Modal } from "antd";
import { useState } from "react";
import InterestForm from "./InterestForm";

export default function InterestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered width={600}>
      {!submitted ? (
        <>
          <h2>Get Early Access</h2>
          <p style={{ marginBottom: 16 }}>
            Join the waitlist and be first to try Sofron.
          </p>

          <InterestForm onSuccess={() => setSubmitted(true)} />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 20 }}>
          <h2>You're in</h2>
          <p>We'll reach out when Sofron is ready.</p>
        </div>
      )}
    </Modal>
  );
}
