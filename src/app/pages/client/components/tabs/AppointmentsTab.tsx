import { useEffect, useState, useCallback } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { message, Modal, Table, Tag, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import RescheduleAppointmentModal from "../../../appointments/components/RescheduleAppointmentModal";

import type { Appointment } from "../../../appointments/types";

/* =========================
   TYPES
========================= */
interface AppointmentApi {
  id: number;
  startTime: string;
  endTime: string;
  status: string;

  serviceBooked?: {
    id: number;
    name: string;
    duration: number;
  };

  organization: {
    id: number;
    name: string;
    timeZone: string;
    publicId: string;
  };

  specialist?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface AppointmentResponse {
  data: {
    appointments: AppointmentApi[];
  };
}

/* =========================
   MAPPER
========================= */
const mapAppointment = (appt: AppointmentApi): Appointment => ({
  id: String(appt.id),
  publicId: appt.organization.publicId,
  organizationId: appt.organization?.id ?? 0,

  status: appt.status as Appointment["status"],

  date: appt.startTime,
  startTime: appt.startTime,
  endTime: appt.endTime,

  serviceBooked: appt.serviceBooked,
  specialist: appt.specialist,
  organization: appt.organization,
});

/* =========================
   STATUS TAG
========================= */
const getStatusTag = (status: string, t: any) => {
  const key = status.toLowerCase();

  const colorMap: Record<string, string> = {
    scheduled: "processing",
    completed: "success",
    cancelled: "error",
  };

  return (
    <Tag color={colorMap[key] || "default"}>
      {t(`clientDashboard.status.${key}`)}
    </Tag>
  );
};

export default function AppointmentsTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* =========================
     FETCH
  ========================= */
  const fetchAppointments = useCallback(async () => {
    setLoading(true);

    try {
      const [upcomingRes, pastRes] = await Promise.all([
        axios.get<AppointmentResponse>("/appointments/me?filter=upcoming"),
        axios.get<AppointmentResponse>("/appointments/me?filter=past"),
      ]);

      setUpcoming(upcomingRes.data.data.appointments.map(mapAppointment));
      setPast(pastRes.data.data.appointments.map(mapAppointment));
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* =========================
     ACTIONS
  ========================= */
  const handleCancel = (appointment: Appointment) => {
    Modal.confirm({
      title: t("clientDashboard.confirmCancelTitle"),
      content: t("clientDashboard.confirmCancelMessage"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await axios.patch(`/appointments/${Number(appointment.id)}/cancel`);
          message.success(t("clientDashboard.messages.cancelSuccess"));
          fetchAppointments();
        } catch {
          message.error(t("clientDashboard.messages.cancelError"));
        }
      },
    });
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleBookAgain = (appointment: Appointment) => {
    const publicId = appointment.organization?.publicId;
    const serviceId = appointment.serviceBooked?.id;

    if (!publicId) return;

    const url = serviceId
      ? `/demo/clinic/${publicId}?serviceId=${serviceId}`
      : `/demo/clinic/${publicId}`;

    navigate(url);
  };

  /* =========================
     TABLE CONFIG
  ========================= */
  const getColumns = (type: "upcoming" | "past") => [
    {
      title: t("clientDashboard.table.service"),
      dataIndex: ["serviceBooked", "name"],
      key: "service",
    },
    {
      title: t("clientDashboard.table.organization"),
      dataIndex: ["organization", "name"],
      key: "organization",
    },
    {
      title: t("clientDashboard.table.specialist"),
      key: "specialist",
      render: (_: any, record: Appointment) => {
        const s = record.specialist;
        return s ? `${s.firstName} ${s.lastName}` : "-";
      },
    },
    {
      title: t("clientDashboard.table.date"),
      key: "date",
      render: (_: any, record: Appointment) =>
        dayjs(record.startTime).format("MMM D, YYYY"),
    },
    {
      title: t("clientDashboard.table.time"),
      key: "time",
      render: (_: any, record: Appointment) =>
        dayjs(record.startTime).format("h:mm A"),
    },
    {
      title: t("clientDashboard.table.status"),
      key: "status",
      render: (_: any, record: Appointment) => getStatusTag(record.status, t),
    },
    {
      key: "actions",
      render: (_: any, record: Appointment) => {
        const items =
          type === "upcoming"
            ? [
                {
                  key: "reschedule",
                  label: t("clientDashboard.actions.reschedule"),
                  onClick: () => handleReschedule(record),
                },
                {
                  key: "cancel",
                  label: t("clientDashboard.actions.cancel"),
                  danger: true,
                  onClick: () => handleCancel(record),
                },
              ]
            : [
                {
                  key: "bookAgain",
                  label: t("clientDashboard.actions.bookAgain"),
                  onClick: () => handleBookAgain(record),
                },
              ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (loading) return <p>{t("common.loading")}</p>;

  return (
    <div className="client-dashboard__section--constrained">
      {/* UPCOMING */}
      <div className="client-appointments-section">
        <h3 className="client-appointments-section-title">
          {t("clientDashboard.sections.upcoming")}
        </h3>

        <div className="client-appointments-table-wrapper">
          <Table
            dataSource={upcoming}
            columns={getColumns("upcoming")}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

      {/* PAST */}
      <div className="client-appointments-section">
        <h3 className="client-appointments-section-title">
          {t("clientDashboard.sections.pastAppointments")}
        </h3>

        <div className="client-appointments-table-wrapper">
          <Table
            dataSource={past}
            columns={getColumns("past")}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      <RescheduleAppointmentModal
        open={modalOpen}
        appointment={selectedAppointment}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchAppointments();
        }}
      />
    </div>
  );
}
