import { Drawer, Tabs, Table, Tag, Typography, Space, Spin, Empty } from "antd";
import { useEffect, useState } from "react";
import axios from "../../../../shared/api/axios";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  open: boolean;
  patientId: number | null;
  patientName?: string;
  onClose: () => void;
}

export default function PatientAppointmentsDrawer({
  open,
  patientId,
  patientName,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);

  useEffect(() => {
    if (!open || !patientId) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`/patients/${patientId}/appointments`);
        console.log(res)
        setUpcoming(res.data.data.upcomingAppointments || []);
        setPast(res.data.data.pastAppointments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [open, patientId]);

  const columns = [
    {
      title: "Date",
      render: (record: any) => dayjs(record.date).format("MMM D, YYYY"),
    },
    {
      title: "Time",
      render: (record: any) =>
        `${dayjs(record.startTime).format("h:mm A")} - ${dayjs(
          record.endTime,
        ).format("h:mm A")}`,
    },
    {
      title: "Service",
      render: (record: any) => record.serviceBooked?.name,
    },
    {
      title: "Specialist",
      render: (record: any) =>
        `${record.specialist?.firstName} ${record.specialist?.lastName}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => <Tag>{status}</Tag>,
    },
  ];

  const renderTable = (data: any[]) => {
    if (loading) return <Spin />;

    if (!data.length) {
      return <Empty description="No appointments" />;
    }

    return (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8 }}
      />
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="100%"
      zIndex={9999}
      title={
        <Space orientation="vertical" size={0}>
          <Text strong>Appointments</Text>
          {patientName && <Text type="secondary">{patientName}</Text>}
        </Space>
      }
    >
      <Tabs
        defaultActiveKey="upcoming"
        items={[
          {
            key: "upcoming",
            label: `Upcoming (${upcoming.length})`,
            children: renderTable(upcoming),
          },
          {
            key: "past",
            label: `Past (${past.length})`,
            children: renderTable(past),
          },
        ]}
      />
    </Drawer>
  );
}
