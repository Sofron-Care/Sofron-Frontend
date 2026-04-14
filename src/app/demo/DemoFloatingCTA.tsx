import { useState } from "react";
import { Button } from "antd";
import { RocketOutlined } from "@ant-design/icons";
import InterestModal from "./InterestModal";

export default function DemoFloatingCTA() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="primary"
        icon={<RocketOutlined />}
        className="demo-floating-cta"
        onClick={() => setOpen(true)}
      >
        Join Waitlist
      </Button>

      <InterestModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
