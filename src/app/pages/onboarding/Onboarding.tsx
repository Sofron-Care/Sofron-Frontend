import { useAuth } from "./../../auth/AuthContext";
import AdminOnboarding from "./AdminOnboarding";
// import EmployeeOnboarding from "./EmployeeOnboarding";

export default function Onboarding() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "clinicAdmin" || user.role === "freelanceAdmin") {
    return <AdminOnboarding />;
  }

//   if (user.role === "specialist" || user.role === "frontDesk") {
//     return <EmployeeOnboarding />;
//   }

  return null;
}
