import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getClinicTourSteps, getClientTourSteps } from "./demoSteps";
import { useDemo } from "../useDemo";

type DemoStep = {
  path?: string;
  tab?: string;
  title: string;
  description: string;
};

export function useDemoTour() {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const { role, setMode, setTabOverride } = useDemo();

  // Extract publicId safely
  const { demoPublicId } = useDemo();

  // Build steps dynamically
  const steps: DemoStep[] = useMemo(() => {
    if (role === "clinicAdmin") {
      if (!demoPublicId) return [];
      return getClinicTourSteps(demoPublicId);
    }

    if (role === "client") {
      return getClientTourSteps(demoPublicId ?? undefined);
    }

    return [];
  }, [demoPublicId, role]);

  const step = steps[stepIndex];

  const next = () => {
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      const nextStep = steps[nextIndex];

      // Route navigation
      if (nextStep.path) {
        navigate(nextStep.path);
      }

      // Tab switching
      if (nextStep.tab) {
        setTabOverride(nextStep.tab);
      }
    } else {
      setMode("free");
      setStepIndex(0);
    }
  };

  const prev = () => {
    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      setStepIndex(prevIndex);
      const prevStep = steps[prevIndex];

      if (prevStep.path) {
        navigate(prevStep.path);
      }
      if (prevStep.tab) {
        setTabOverride(prevStep.tab);
      }
    }
  };

  const exit = () => {
    setMode("free");
    setTabOverride(null); 
    setStepIndex(0); 
  };

  return {
    step,
    stepIndex,
    total: steps.length,
    next,
    prev,
    exit,
    ready: steps.length > 0,
  };
}
