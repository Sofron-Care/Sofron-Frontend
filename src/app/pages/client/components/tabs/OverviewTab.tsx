import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

import type { Appointment } from "../../../appointments/types";

interface AppointmentResponse {
  data: {
    appointments: Appointment[];
  };
}

export default function OverviewTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [nextAppointment, setNextAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNext = async () => {
      setLoading(true);

      try {
        const res = await axios.get<AppointmentResponse>(
          "/appointments/me?filter=upcoming"
        );

        const appointments = res.data.data.appointments;

        if (appointments.length > 0) {
          setNextAppointment(appointments[0]);
        }
      } catch {
        message.error(t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchNext();
  }, [t]);

  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <div className="client-dashboard__section">
      {/* NEXT APPOINTMENT */}
      <div className="client-overview__card">
        <h3>{t("clientDashboard.overview.nextAppointment")}</h3>

        {nextAppointment ? (
          <div className="client-overview__appointment">
            <p className="client-overview__primary">
              {nextAppointment.serviceBooked?.name}
            </p>

            <p className="client-overview__secondary">
              {nextAppointment.organization?.name}
            </p>

            <p className="client-overview__meta">
              {nextAppointment.startTime}
            </p>

            <div className="client-overview__actions">
              <Button
                onClick={() =>
                  navigate(
                    `/booking/${nextAppointment.organizationId}?serviceId=${nextAppointment.serviceBooked?.id}`
                  )
                }
              >
                {t("clientDashboard.actions.bookAgain")}
              </Button>
            </div>
          </div>
        ) : (
          <p>{t("clientDashboard.overview.noUpcoming")}</p>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="client-overview__card">
        <h3>{t("clientDashboard.overview.quickActions")}</h3>

        <div className="client-overview__actions">
          <Button onClick={() => navigate("/")}>
            {t("clientDashboard.actions.findClinic")}
          </Button>

          <Button onClick={() => navigate("/demo/app/client?tab=appointments")}>
            {t("clientDashboard.actions.viewAppointments")}
          </Button>
        </div>
      </div>
    </div>
  );
}