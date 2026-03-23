import { Empty, Spin, Table, Tag, Typography, message } from "antd";
import { useEffect, useState } from "react";
import axios from "../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  patientId: number | null;
  type: "upcoming" | "past";
}

export default function PatientAppointmentsList({ patientId, type }: Props) {
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!patientId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `/patients/${patientId}/appointments?type=${type}`,
      );

      setAppointments(res.data.data.appointments || []);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t("appointments.messages.loadFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [patientId, type]);

  const columns = [
    {
      title: t("appointments.table.date"),
      render: (_: any, record: any) => (
        <Text>{dayjs(record.startTime).format("MMM D, YYYY")}</Text>
      ),
    },
    {
      title: t("appointments.table.time"),
      render: (_: any, record: any) => (
        <Text>{dayjs(record.startTime).format("h:mm A")}</Text>
      ),
    },
    {
      title: t("appointments.table.service"),
      render: (_: any, record: any) => (
        <Text>{record.serviceBooked?.name}</Text>
      ),
    },
    {
      title: t("appointments.table.specialist"),
      render: (_: any, record: any) => (
        <Text>
          {record.specialist?.firstName} {record.specialist?.lastName}
        </Text>
      ),
    },
    {
      title: t("appointments.table.status"),
      dataIndex: "status",
      render: (status: string) => <Tag>{status}</Tag>,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <Spin />
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <Empty
        description={
          type === "upcoming"
            ? t("appointments.empty.upcoming")
            : t("appointments.empty.past")
        }
      />
    );
  }

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={appointments}
      pagination={false}
    />
  );
}
