import { useEffect, useState } from "react";
import api from "../../shared/api/axios";
import { useAuth } from "../auth/AuthContext";
import { DemoContext } from "./DemoContext";
import type { DemoUsers, Role } from "./DemoContext";
export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const { login } = useAuth();

  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<DemoUsers | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [mode, setMode] = useState<"guided" | "free" | null>(null);
  const [tabOverride, setTabOverride] = useState<string | null>(null);
  const demoPublicId = users?.clinicAdmin?.organization?.publicId || null;
  useEffect(() => {
    const path = window.location.pathname;

    if (!path.startsWith("/demo")) {
      setLoading(false);
      return;
    }

    setIsDemo(true);

    const fetchDemoData = async () => {
      try {
        const res = await api.get("/demo/data");

        setUsers(res.data.data);
      } catch (err) {
        console.error("Failed to fetch demo data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemoData();
  }, []);

  const loginAs = async (role: Role) => {
    if (!users) return;

    const user = users[role];
    if (!user) return;

    await login(user.email, users.password || "Password123!");
  };

  return (
    <DemoContext.Provider
      value={{
        isDemo,
        loading,
        users,
        role,
        mode,
        demoPublicId,
        setRole,
        setMode,
        loginAs,
        tabOverride,
        setTabOverride,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};
