import { Table, Tag } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  weeklyPattern: any[];
}

export default function WeeklyAvailabilityTable({ weeklyPattern }: Props) {
  const { t } = useTranslation();

  const days = [
    t("common.days.sunday"),
    t("common.days.monday"),
    t("common.days.tuesday"),
    t("common.days.wednesday"),
    t("common.days.thursday"),
    t("common.days.friday"),
    t("common.days.saturday"),
  ];
  const grouped = days.map((day, index) => {
    const blocks = weeklyPattern
      .filter((entry) => entry.day === index)
      .map((entry) => `${entry.start} - ${entry.end}`);

    return {
      key: index,
      day,
      blocks,
    };
  });

  const columns = [
    {
      title: t("schedule.availability.table.day"),
      dataIndex: "day",
    },
    {
      title: t("schedule.availability.table.availability"),
      render: (record: any) =>
        record.blocks.length > 0 ? (
          record.blocks.map((b: string) => (
            <Tag key={b} style={{ marginBottom: 4 }}>
              {b}
            </Tag>
          ))
        ) : (
          <Tag color="default">
            {t("schedule.availability.table.unavailable")}
          </Tag>
        ),
    },
  ];

  return <Table columns={columns} dataSource={grouped} pagination={false} />;
}
