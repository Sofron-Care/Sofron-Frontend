import { Button } from "antd";
import { useState, useEffect } from "react";
import PageLayout from "./../../layout/PageLayout";
import EmployeeTable from "./components/EmployeeTable";
import InviteEmployeeModal from "./components/InviteEmployeeModal";
import axios from "./../../../shared/api/axios";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";

export default function SpecialistsPage() {
  const [open, setOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchEmployees = async () => {
    console.log("FETCHING EMPLOYEES"); // 🔍 Add this
    setLoading(true);
    try {
      const res = await axios.get("/organizations/employees");
      console.log("API RESULT:", res.data.data.employees); // 🔍 Add this
      setEmployees(res.data.data.employees);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <PageLayout
        title="Specialists"
        subtitle="Manage your clinic staff and invite new employees."
        primaryAction={
          user && can(user.role, "create:employee") ? (
            <Button type="primary" onClick={() => setOpen(true)}>
              Invite Employee
            </Button>
          ) : null
        }
      >
        <div className="card card-table">
          <EmployeeTable employees={employees} loading={loading} />
        </div>
      </PageLayout>

      <InviteEmployeeModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchEmployees}
      />
    </>
  );
}
