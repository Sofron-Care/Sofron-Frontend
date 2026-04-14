// src/app/demo/DemoLayout.tsx

import { Outlet } from "react-router-dom";
import { DemoProvider } from "./DemoProvider";
import DemoWrapper from "./DemoWrapper";
import DemoTour from "./components/DemoTour";
import DemoFloatingCTA from "./DemoFloatingCTA";

export default function DemoLayout() {
  return (
    <DemoProvider>
      <DemoWrapper>
        <Outlet />
        <DemoTour />
        <DemoFloatingCTA />
      </DemoWrapper>
    </DemoProvider>
  );
}
