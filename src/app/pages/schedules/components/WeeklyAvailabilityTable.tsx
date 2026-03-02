import { Table, Tag } from "antd";

interface Props {
  weeklyPattern: any[];
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function WeeklyAvailabilityTable({ weeklyPattern }: Props) {
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
      title: "Day",
      dataIndex: "day",
    },
    {
      title: "Availability",
      render: (record: any) =>
        record.blocks.length > 0 ? (
          record.blocks.map((b: string) => (
            <Tag key={b} style={{ marginBottom: 4 }}>
              {b}
            </Tag>
          ))
        ) : (
          <Tag color="default">Unavailable</Tag>
        ),
    },
  ];

  return <Table columns={columns} dataSource={grouped} pagination={false} />;
}
