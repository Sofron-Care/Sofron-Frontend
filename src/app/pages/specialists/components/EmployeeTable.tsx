import { Table, Tag, Button, Dropdown, Modal } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "../../../auth/AuthContext";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "active" | "pending" | "suspended";
  lastLoginAt: string | null;
}

interface Props {
  employees: Employee[];
  loading: boolean;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  currentUserId?: string;
}

export default function EmployeeTable({
  employees,
  loading,
  onSuspend,
  onReactivate,
  currentUserId,
}: Props) {
  const { user } = useAuth();

  const canManageEmployees =
    user?.role === "clinicAdmin" || user?.role === "freelanceAdmin";

const columns: ColumnsType<Employee> = [
  {
    title: "Name",
    render: (_, record) => `${record.firstName} ${record.lastName}`,
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    render: (role: string) => <Tag color="geekblue">{role}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "Active", value: "active" },
      { text: "Pending", value: "pending" },
      { text: "Suspended", value: "suspended" },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status: string) => {
      const map: Record<string, { color: string; label: string }> = {
        active: { color: "green", label: "Active" },
        pending: { color: "gold", label: "Pending" },
        suspended: { color: "red", label: "Suspended" },
      };

      const config = map[status];

      return <Tag color={config.color}>{config.label}</Tag>;
    },
  },
  {
    title: "Last Login",
    dataIndex: "lastLoginAt",
    render: (date: string | null) =>
      date ? new Date(date).toLocaleDateString() : "—",
  },

  ...(canManageEmployees
    ? [
        {
          key: "actions",
          render: (_: any, record: Employee) => {
            if (record.id === currentUserId) return null;

            const items = [];

            if (
              record.status === "active" ||
              record.status === "pending"
            ) {
              items.push({
                key: "suspend",
                label: "Suspend",
                danger: true,
                onClick: () => confirmSuspend(record.id),
              });
            }

            if (record.status === "suspended") {
              items.push({
                key: "reactivate",
                label: "Reactivate",
                onClick: () => onReactivate(record.id),
              });
            }

            if (items.length === 0) return null;

            return (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            );
          },
        },
      ]
    : []),
];

  const confirmSuspend = (id: string) => {
    Modal.confirm({
      title: "Suspend Employee",
      content: "Are you sure you want to suspend this employee?",
      okText: "Suspend",
      okButtonProps: { danger: true },
      onOk: () => onSuspend(id),
    });
  };

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={employees}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
}
