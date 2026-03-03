import { Table, Tag, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const columns: any[] = [
    {
      title: t("schedule.overrides.table.date"),
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("schedule.overrides.table.timeRange"),
      render: (record: any) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: t("schedule.overrides.table.type"),
      dataIndex: "type",
      render: (type: string) =>
        type === "available" ? (
          <Tag color="green">{t("schedule.overrides.types.available")}</Tag>
        ) : (
          <Tag color="red">{t("schedule.overrides.types.unavailable")}</Tag>
        ),
    },
    {
      title: t("schedule.overrides.table.reason"),
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
                label: t("common.delete"),
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
