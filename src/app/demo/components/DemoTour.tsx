import { Card, Button } from "antd";
import { useDemo } from "../useDemo";
import { useDemoTour } from "./../helpers/useDemoTour";

export default function DemoTour() {
  const { mode } = useDemo();
  const { step, stepIndex, total, next, prev, exit } = useDemoTour();

  if (mode !== "guided") return null;

  return (
    <div className="demo-tour-overlay">
      <Card className="demo-tour-card">
        <h3>{step.title}</h3>
        <p>{step.description}</p>

        <div style={{ marginTop: 16 }}>
          <span>
            Step {stepIndex + 1} of {total}
          </span>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Button onClick={prev} disabled={stepIndex === 0}>
            Back
          </Button>

          <Button type="primary" onClick={next}>
            {stepIndex === total - 1 ? "Finish" : "Next"}
          </Button>

          <Button onClick={exit}>Exit</Button>
        </div>
      </Card>
    </div>
  );
}
