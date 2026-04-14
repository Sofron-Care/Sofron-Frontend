type StepKey = "service" | "specialist" | "datetime" | "details" | "confirm";

type Props = {
  currentStep: StepKey;
  completedSteps: StepKey[];
  schedulingMode: "organization" | "specialist";
  onStepChange: (step: StepKey) => void;
};

export default function BookingStepIndicator({
  currentStep,
  completedSteps,
  schedulingMode,
  onStepChange,
}: Props) {
  const allSteps: { key: StepKey; label: string }[] = [
    { key: "service", label: "Service" },
    ...(schedulingMode === "specialist"
      ? [{ key: "specialist" as StepKey, label: "Specialist" }]
      : []),
    { key: "datetime", label: "Date & Time" },
    { key: "details", label: "Details" },
    { key: "confirm", label: "Summary" },
  ];

  return (
    <div className="booking-step-indicator">
      {allSteps.map((step, index) => {
        const isActive = currentStep === step.key;
        const isDone = completedSteps.includes(step.key);

        return (
          <button
            key={step.key}
            type="button"
            className={`booking-step-indicator__item ${
              isActive ? "is-active" : ""
            } ${isDone ? "is-done" : ""}`}
            onClick={() => onStepChange(step.key)}
          >
            <span>{step.label}</span>
            {index < allSteps.length - 1 && (
              <span className="booking-step-indicator__divider">/</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
