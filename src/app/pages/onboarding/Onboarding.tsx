import { useAuth } from "./../../auth/AuthContext";
import AdminOnboarding from "./AdminOnboarding";
import EmployeeOnboarding from "./EmployeeOnboarding";
import ClientOnboarding from "./ClientOnboarding";

export default function Onboarding() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "clinicAdmin" || user.role === "freelanceAdmin") {
    return <AdminOnboarding />;
  }

  if (user.role === "specialist" || user.role === "frontDesk") {
    return <EmployeeOnboarding />;
  }

  if (user.role === "client") {
    return <ClientOnboarding />;
  }

  return null;
}
