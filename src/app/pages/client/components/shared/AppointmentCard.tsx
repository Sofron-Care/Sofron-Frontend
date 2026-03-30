import { Button, Tag } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import type { Appointment } from "../../../appointments/types";

interface Props {
  appointment: Appointment;
  type: "upcoming" | "past";
  onCancel?: (appt: Appointment) => void;
  onReschedule?: (appt: Appointment) => void;
  onBookAgain?: (appt: Appointment) => void;
}

export default function AppointmentCard({
  appointment,
  type,
  onCancel,
  onReschedule,
  onBookAgain,
}: Props) {
  const { t } = useTranslation();

  const start = dayjs(appointment.startTime);

  return (
    <div className="appointment-card">
      <div className="appointment-card__info">
        <div className="appointment-card__title">
          {appointment.serviceBooked?.name}
        </div>

        <div className="appointment-card__meta">
          {appointment.organization?.name}
        </div>

        <div className="appointment-card__meta">
          {start.format("MMM D, YYYY • h:mm A")}
        </div>

        <Tag>{appointment.status}</Tag>
      </div>

      <div className="appointment-card__actions">
        {type === "upcoming" && (
          <>
            <Button onClick={() => onReschedule?.(appointment)}>
              {t("clientDashboard.actions.reschedule")}
            </Button>

            <Button danger onClick={() => onCancel?.(appointment)}>
              {t("clientDashboard.actions.cancel")}
            </Button>
          </>
        )}

        {type === "past" && (
          <Button onClick={() => onBookAgain?.(appointment)}>
            {t("clientDashboard.actions.bookAgain")}
          </Button>
        )}
      </div>
    </div>
  );
}