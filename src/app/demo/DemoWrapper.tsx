import type { ReactNode } from "react";
import { useDemo } from "./useDemo";

export default function DemoWrapper({ children }: { children: ReactNode }) {
  const { isDemo, loading } = useDemo();

  if (!isDemo) return <>{children}</>;

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Loading demo...</h2>
      </div>
    );
  }

  return <>{children}</>;
}
