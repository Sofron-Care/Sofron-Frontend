import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { Button, message } from "antd";

import type { Appointment } from "../../../appointments/types";

/* =========================
   RESPONSE
========================= */
interface AppointmentResponse {
  data: {
    appointments: Appointment[];
  };
}

export default function ReviewsTab() {
  const { t } = useTranslation();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH PAST APPOINTMENTS
  ========================= */
  useEffect(() => {
    const fetchPast = async () => {
      setLoading(true);

      try {
        const res = await axios.get<AppointmentResponse>(
          "/appointments/me?filter=past"
        );

        setAppointments(res.data.data.appointments);
      } catch {
        message.error(t("clientDashboard.messages.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchPast();
  }, [t]);

  /* =========================
     ACTION (DEMO PLACEHOLDER)
  ========================= */
  const handleReview = () => {
    message.info(t("clientDashboard.reviews.comingSoon"));
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <div className="client-dashboard__section">
      <h3>{t("clientDashboard.reviews.title")}</h3>

      {appointments.length === 0 ? (
        <p>{t("clientDashboard.reviews.empty")}</p>
      ) : (
        <div className="client-reviews__list">
          {appointments.map((appt) => (
            <div key={appt.id} className="client-reviews__card">
              <div className="client-reviews__info">
                <p className="client-reviews__primary">
                  {appt.serviceBooked?.name}
                </p>

                <p className="client-reviews__secondary">
                  {appt.organization?.name}
                </p>

                <p className="client-reviews__meta">
                  {appt.startTime}
                </p>
              </div>

              <div className="client-reviews__actions">
                <Button onClick={handleReview}>
                  {t("clientDashboard.reviews.leaveReview")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}