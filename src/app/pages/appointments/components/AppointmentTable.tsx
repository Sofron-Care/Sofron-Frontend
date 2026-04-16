import { Table, Button, Dropdown, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext";
import { can } from "../../../utils/permissions";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import type { Appointment } from "../types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { MoreOutlined } from "@ant-design/icons";

interface Props {
  appointments: Appointment[];
  loading: boolean;
  view: string;
  statusFilter?: string;
  search: string;
  onAction: (action: string, record: Appointment) => void;
  onOpenDetails: (id: string) => void;
}

export default function AppointmentTable({
  appointments,
  loading,
  view,
  statusFilter,
  search,
  onAction,
  onOpenDetails,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const filtered = appointments.filter((appt) => {
    if (view === "mine") {
      if (!appt.specialist || appt.specialist.id !== user?.id) {
        return false;
      }
    }

    if (statusFilter && appt.status !== statusFilter) {
      return false;
    }

    if (search) {
      const fullName = appt.client
        ? `${appt.client.firstName} ${appt.client.lastName}`
        : appt.guestClient
          ? `${appt.guestClient.firstName} ${appt.guestClient.lastName}`
          : "";

      if (!fullName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const handleMenuClick = (action: string, record: Appointment) => {
    if (action === "cancel") {
      Modal.confirm({
        title: t("appointments.confirmations.cancelTitle"),
        content: t("appointments.confirmations.cancelContent"),
        okText: t("common.confirm"),
        cancelText: t("common.cancel"),
        okButtonProps: { danger: true },
        onOk: () => onAction(action, record),
      });
      return;
    }

    if (action === "noshow") {
      Modal.confirm({
        title: t("appointments.confirmations.noShowTitle"),
        content: t("appointments.confirmations.noShowContent"),
        okText: t("common.confirm"),
        cancelText: t("common.cancel"),
        okButtonProps: { danger: true },
        onOk: () => onAction(action, record),
      });
      return;
    }

    if (action === "checkin") {
      Modal.confirm({
        title: t("appointments.confirmations.checkInTitle"),
        content: t("appointments.confirmations.checkInContent"),
        okText: t("common.confirm"),
        cancelText: t("common.cancel"),
        onOk: () => onAction(action, record),
      });
      return;
    }

    onAction(action, record);
  };

  const columns = [
    {
      title: t("appointments.columns.date"),
      dataIndex: "date",
      key: "date",
    },
    {
      title: t("appointments.columns.time"),
      key: "time",
      render: (_: any, record: Appointment) => {
        const start = dayjs(record.startTime).local();
        const end = dayjs(record.endTime).local();

        const sameMeridiem = start.format("A") === end.format("A");

        if (sameMeridiem) {
          return `${start.format("h:mm")} – ${end.format("h:mm A")}`;
        }

        return `${start.format("h:mm A")} – ${end.format("h:mm A")}`;
      },
    },
    {
      title: t("appointments.columns.client"),
      key: "client",
      render: (_: any, record: Appointment) =>
        record.client
          ? `${record.client.firstName} ${record.client.lastName}`
          : record.guestClient
            ? `${record.guestClient.firstName} ${record.guestClient.lastName}`
            : "-",
    },
    {
      title: t("appointments.columns.service"),
      dataIndex: ["serviceBooked", "name"],
      key: "service",
    },
    {
      title: t("appointments.columns.specialist"),
      key: "specialist",
      render: (_: any, record: Appointment) =>
        record.specialist
          ? `${record.specialist.firstName} ${record.specialist.lastName}`
          : "-",
    },
    {
      title: t("appointments.columns.status"),
      key: "status",
      render: (_: any, record: Appointment) => (
        <AppointmentStatusBadge status={record.status} />
      ),
    },
    {
      title: t("appointments.columns.actions"),
      key: "actions",
      render: (_: any, record: Appointment) => {
        const items = [];

        if (can(user?.role, "reschedule:appointment")) {
          items.push({
            key: "reschedule",
            label: t("appointments.actions.reschedule"),
          });
        }

        if (can(user?.role, "checkin:appointment")) {
          items.push({
            key: "checkin",
            label: t("appointments.actions.checkin"),
          });
        }

        if (can(user?.role, "cancel:appointment")) {
          items.push({
            key: "cancel",
            label: (
              <span style={{ color: "var(--color-error)" }}>
                {t("appointments.actions.cancel")}
              </span>
            ),
          });
        }

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{
                items,
                onClick: ({ key }) => handleMenuClick(key, record),
              }}
              trigger={["click"]}
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                loading={loading}
                disabled={loading}
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={filtered}
      loading={loading}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => onOpenDetails(record.id),
      })}
      rowClassName={() => "clickable-row"}
      scroll={{x: 600}}
    />
  );
}
