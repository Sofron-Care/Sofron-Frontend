import type { AppointmentStatus } from "../types";
import { useTranslation } from "react-i18next";

interface Props {
  status: AppointmentStatus;
}

function normalizeStatus(status: AppointmentStatus) {
  return status.toLowerCase().replace("-", "_");
}

export default function AppointmentStatusBadge({ status }: Props) {
  const { t } = useTranslation();

  const normalized = normalizeStatus(status);

  return (
    <span className={`status-tag status-${normalized}`}>
      {t(`appointments.status.${status}`)}
    </span>
  );
}
