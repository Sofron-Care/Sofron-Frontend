import { Table, Tag } from "antd";

interface Props {
  employees: any[];
  loading: boolean;
}

export default function EmployeeTable({ employees, loading }: Props) {
  const columns = [
    {
      title: "Name",
      render: (record: any) => `${record.firstName} ${record.lastName}`,
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
      dataIndex: "isActive",
      render: (active: boolean) =>
        active ? <Tag color="green">Active</Tag> : <Tag>Pending</Tag>,
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "—",
    },
  ];

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
