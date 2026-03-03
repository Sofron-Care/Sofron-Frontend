import { Modal, Descriptions, Spin, Button, Space, Input } from "antd";
import { useTranslation } from "react-i18next";
import AppointmentStatusBadge from "./AppointmentStatusBadge";
import type { Appointment } from "../types";
import dayjs from "dayjs";
import { useAuth } from "../../../auth/AuthContext";
import { useState } from "react";

interface Props {
  open: boolean;
  loading: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onAddNote: (text: string) => Promise<void>;
}

export default function AppointmentDetailsModal({
  open,
  loading,
  appointment,
  onClose,
  onAddNote,
}: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  if (!appointment) return null;

  const clientName = appointment.client
    ? `${appointment.client.firstName} ${appointment.client.lastName}`
    : appointment.guestClient
      ? `${appointment.guestClient.firstName} ${appointment.guestClient.lastName}`
      : "-";

  const canAddNote =
    user?.role === "clinicAdmin" ||
    user?.role === "frontDesk" ||
    ((user?.role === "specialist" || user?.role === "freelanceAdmin") &&
      appointment.specialist?.id === user?.id);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      setNoteLoading(true);

      await onAddNote(noteText.trim());

      setNoteText("");
    } finally {
      setNoteLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      title={t("appointments.details.title")}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t("appointments.columns.status")}>
              <AppointmentStatusBadge status={appointment.status} />
            </Descriptions.Item>

            <Descriptions.Item label={t("appointments.columns.date")}>
              {appointment.date}
            </Descriptions.Item>

            <Descriptions.Item label={t("appointments.columns.time")}>
              {dayjs(appointment.startTime).format("h:mm A")} –{" "}
              {dayjs(appointment.endTime).format("h:mm A")}
            </Descriptions.Item>

            <Descriptions.Item label={t("appointments.columns.client")}>
              {clientName}
            </Descriptions.Item>

            <Descriptions.Item label={t("appointments.columns.service")}>
              {appointment.serviceBooked?.name || "-"}
            </Descriptions.Item>

            <Descriptions.Item label={t("appointments.columns.specialist")}>
              {appointment.specialist
                ? `${appointment.specialist.firstName} ${appointment.specialist.lastName}`
                : "-"}
            </Descriptions.Item>
          </Descriptions>

          <div style={{ marginTop: 24 }}>
            <h4>{t("appointments.notes.title")}</h4>

            {appointment.notes?.length ? (
              appointment.notes.map((n, i) => (
                <div key={i} className="note-entry">
                  <div className="note-meta">
                    {dayjs(n.timestamp).format("MMM D, YYYY h:mm A")}
                  </div>
                  <div>{n.note}</div>
                </div>
              ))
            ) : (
              <div>{t("appointments.notes.empty")}</div>
            )}
          </div>

          {canAddNote && (
            <div style={{ marginTop: 16 }}>
              <Input.TextArea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder={t("appointments.notes.placeholder")}
              />

              <div style={{ marginTop: 8, textAlign: "right" }}>
                <Button
                  type="primary"
                  loading={noteLoading}
                  disabled={!noteText.trim()}
                  onClick={handleAddNote}
                >
                  {t("appointments.notes.add")}
                </Button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: "right" }}>
            <Space>
              <Button onClick={onClose}>{t("common.close")}</Button>
            </Space>
          </div>
        </>
      )}
    </Modal>
  );
}
