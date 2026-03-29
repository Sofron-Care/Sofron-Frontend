import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Empty,
  Spin,
  message,
  Dropdown,
  Modal,
  Segmented,
} from "antd";
import { useTranslation } from "react-i18next";
import PageLayout from "../../layout/PageLayout";
import api from "../../../shared/api/axios";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "../../auth/AuthContext";
import { MoreOutlined } from "@ant-design/icons";

interface Appointment {
  id: string;
  startTime: string;
  status: "scheduled" | "checked_in" | "no_show" | "cancelled";
  client?: {
    firstName: string;
    lastName: string;
  };
  guestClient?: {
    name: string;
  };
  serviceBooked?: {
    name: string;
  };
  specialist?: {
    firstName: string;
    lastName: string;
  };
}

export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "no_show"
  | "cancelled"
  | "completed"
  | "confirmed"
  | "rescheduled";

const normalizeStatus = (status: string): AppointmentStatus => {
  const map: Record<string, AppointmentStatus> = {
    Scheduled: "scheduled",
    "Checked-In": "checked_in",
    "No-Show": "no_show",
    Cancelled: "cancelled",
    Completed: "completed",
    Confirmed: "confirmed",
    Rescheduled: "rescheduled",
  };

  return map[status] ?? "scheduled";
};

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "checked_in" | "no_show" | "cancelled" | "remaining"
  >("all");

  useEffect(() => {
    fetchToday();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchToday, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchToday = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointments/today", {
        params: viewAll ? { view: "all" } : {},
      });

      setAppointments(
        res.data.data.appointments.map((a: any) => ({
          ...a,
          status: normalizeStatus(a.status),
        })),
      );
    } catch {
      message.error(t("dashboard.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToday();
  }, [viewAll]);

  const total = appointments.length;
  const checkedIn = appointments.filter(
    (a) => a.status === "checked_in",
  ).length;
  const noShows = appointments.filter((a) => a.status === "no_show").length;
  const now = new Date();

  const remainingToday = appointments.filter(
    (a) => a.status === "scheduled" && new Date(a.startTime) > now,
  ).length;

  const columns: ColumnsType<Appointment> = [
    {
      title: t("dashboard.table.time"),
      dataIndex: "startTime",
      render: (time: string) =>
        new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: t("dashboard.table.patient"),
      render: (record: any) =>
        record.client
          ? `${record.client.firstName} ${record.client.lastName}`
          : `${record.guestClient?.firstName} ${record.guestClient?.lastName}`,
    },
    {
      title: t("dashboard.table.service"),
      render: (record: any) => record.serviceBooked?.name,
    },
    {
      title: t("dashboard.table.specialist"),
      render: (record: any) =>
        record.specialist
          ? `${record.specialist.firstName} ${record.specialist.lastName}`
          : "—",
    },
    {
      title: t("dashboard.table.status"),
      dataIndex: "status",
      render: (status: string) => {
        const map: any = {
          scheduled: { color: "blue", label: t("dashboard.status.scheduled") },
          checked_in: {
            color: "green",
            label: t("dashboard.status.checked_in"),
          },
          no_show: { color: "red", label: t("dashboard.status.no_show") },
          cancelled: {
            color: "default",
            label: t("dashboard.status.cancelled"),
          },
        };

        const config = map[status] || { color: "default", label: status };

        return (
          <Tag className={`status-tag status-${status}`}>{config.label}</Tag>
        );
      },
    },
    {
      title: t("dashboard.table.actions"),
      render: (_, record) => {
        if (record.status !== "scheduled") return null;

        const items = [
          {
            key: "checkin",
            label: t("dashboard.actions.checkIn"),
            onClick: () => confirmCheckIn(record.id),
          },
          {
            key: "noShow",
            label: t("dashboard.actions.noShow"),
            danger: true,
            onClick: () => confirmNoShow(record.id),
          },
          {
            key: "cancel",
            label: t("dashboard.actions.cancel"),
            danger: true,
            onClick: () => confirmCancel(record.id),
          },
        ];

        const confirmCheckIn = (id: string) => {
          Modal.confirm({
            title: t("dashboard.confirm.checkIn.title"),
            content: t("dashboard.confirm.checkIn.content"),
            okText: t("common.confirm"),
            cancelText: t("common.cancel"),
            onOk: () => handleCheckIn(id),
          });
        };

        const confirmNoShow = (id: string) => {
          Modal.confirm({
            title: t("dashboard.confirm.noShow.title"),
            content: t("dashboard.confirm.noShow.content"),
            okText: t("common.confirm"),
            cancelText: t("common.cancel"),
            okButtonProps: { danger: true },
            onOk: () => handleNoShow(id),
          });
        };

        const confirmCancel = (id: string) => {
          Modal.confirm({
            title: t("dashboard.confirm.cancel.title"),
            content: t("dashboard.confirm.cancel.content"),
            okText: t("common.confirm"),
            cancelText: t("common.cancel"),
            okButtonProps: { danger: true },
            onOk: () => handleCancel(id),
          });
        };

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              loading={updatingId === record.id}
              disabled={updatingId !== null}
            />
          </Dropdown>
        );
      },
    },
  ];

  const updateLocalStatus = (id: string, status: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  };

  const handleCheckIn = async (id: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/appointments/${id}/checkin`);
      updateLocalStatus(id, "checked_in");
    } catch {
      message.error(t("dashboard.messages.actionError"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNoShow = async (id: string) => {
    try {
      await api.patch(`/appointments/${id}/no-show`);

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "no_show" } : appt,
        ),
      );

      message.success(t("dashboard.messages.noShowSuccess"));
    } catch {
      message.error(t("dashboard.messages.actionError"));
    }
  };

  const handleCancel = async (id: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/appointments/${id}/cancel`);
      updateLocalStatus(id, "cancelled");
    } catch {
      message.error(t("dashboard.messages.actionError"));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === "all") return true;

    if (statusFilter === "remaining") {
      return a.status === "scheduled" && new Date(a.startTime) > now;
    }

    return a.status === statusFilter;
  });

  return (
    <PageLayout title={t("dashboard.title")} subtitle={t("dashboard.subtitle")}>
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("dashboard.stats.appointmentsToday")}
          </div>
          <div className="dashboard-stat-value">{total}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("dashboard.stats.checkedIn")}
          </div>
          <div className="dashboard-stat-value">{checkedIn}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("dashboard.stats.noShows")}
          </div>
          <div className="dashboard-stat-value">{noShows}</div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("dashboard.stats.remaining_today")}
          </div>
          <div className="dashboard-stat-value">{remainingToday}</div>
        </div>
      </div>

      {loading ? (
        <Spin />
      ) : appointments.length === 0 ? (
        <Empty description={t("dashboard.table.empty")} />
      ) : (
        <>
          {user?.role === "specialist" && (
            <div style={{ marginBottom: 16 }}>
              <Button
                type={viewAll ? "default" : "primary"}
                onClick={() => setViewAll(false)}
              >
                {t("dashboard.view.mine")}
              </Button>

              <Button
                style={{ marginLeft: 8 }}
                type={viewAll ? "primary" : "default"}
                onClick={() => setViewAll(true)}
              >
                {t("dashboard.view.all")}
              </Button>
            </div>
          )}
          <div className="dashboard-filter-bar">
            <Segmented
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
              options={[
                { label: t("dashboard.filters.all"), value: "all" },
                { label: t("dashboard.filters.scheduled"), value: "scheduled" },
                {
                  label: t("dashboard.filters.checkedIn"),
                  value: "checked_in",
                },
                { label: t("dashboard.filters.noShow"), value: "no_show" },
                { label: t("dashboard.filters.cancelled"), value: "cancelled" },
                { label: t("dashboard.filters.remaining"), value: "remaining" },
              ]}
              style={{ marginBottom: 16 }}
            />
          </div>
          <Table
            rowKey="id"
            size="middle"
            columns={columns}
            dataSource={filteredAppointments}
            pagination={false}
          />
        </>
      )}
    </PageLayout>
  );
}
