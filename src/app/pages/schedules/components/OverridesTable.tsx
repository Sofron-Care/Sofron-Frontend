import { Table, Tag, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

interface Props {
  overrides: any[];
  loading: boolean;
  onDelete?: (id: string) => void;
}

export default function OverridesTable({
  overrides,
  loading,
  onDelete,
}: Props) {
  const columns: any[] = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Time Range",
      render: (record: any) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) =>
        type === "available" ? (
          <Tag color="green">Available</Tag>
        ) : (
          <Tag color="red">Unavailable</Tag>
        ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (reason: string) => reason || "—",
    },
  ];

  if (onDelete) {
    columns.push({
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record.id),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    });
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={overrides}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
}
