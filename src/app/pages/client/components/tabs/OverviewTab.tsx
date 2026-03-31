import { useEffect, useState } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { Button, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../../../utils/time";
import type { Appointment } from "../../../appointments/types";

interface AppointmentResponse {
  data: {
    appointments: Appointment[];
  };
}

export default function OverviewTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNext = async () => {
      setLoading(true);

      try {
        const res = await axios.get<AppointmentResponse>(
          "/appointments/me?filter=upcoming",
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
    <div className="client-dashboard__section--fluid client-dashboard__overview">
      {/* NEXT APPOINTMENT */}
      <Card className="client-overview__card client-overview__card--highlight">
        <h3>{t("clientDashboard.overview.nextAppointment")}</h3>

        {nextAppointment ? (
          <div className="client-overview__appointment">
            <p className="client-overview__primary">
              {nextAppointment.serviceBooked?.name}
            </p>

            <p className="client-overview__secondary">
              {nextAppointment.organization?.name}
            </p>

            <p className="client-overview__time">
              {formatTime(nextAppointment.startTime)}
            </p>

            <div className="client-overview__actions">
              <Button
                type="primary"
                onClick={() =>
                  navigate(
                    `/demo/clinic/${nextAppointment.organization?.publicId}?serviceId=${nextAppointment.serviceBooked?.id}`,
                  )
                }
              >
                {t("clientDashboard.actions.bookAgain")}
              </Button>
            </div>
          </div>
        ) : (
          <p className="client-overview__empty">
            {t("clientDashboard.overview.noUpcoming")}
          </p>
        )}
      </Card>

      {/* QUICK ACTIONS */}
      <Card
        className="client-overview__card"
        title={t("clientDashboard.overview.quickActions")}
      >
        <div className="client-overview__actions">
          <Button onClick={() => navigate("/demo/search")}>
            {t("clientDashboard.actions.findClinic")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
