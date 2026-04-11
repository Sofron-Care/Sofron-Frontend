// src/app/demo/DemoLayout.tsx

import { Outlet } from "react-router-dom";
import { DemoProvider } from "./DemoProvider";
import DemoWrapper from "./DemoWrapper";

export default function DemoLayout() {
  return (
    <DemoProvider>
      <DemoWrapper>
        <Outlet />
      </DemoWrapper>
    </DemoProvider>
  );
}
