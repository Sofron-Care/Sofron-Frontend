import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import Nav from "./../home/components/Nav";
import Footer from "./../home/components/Footer";

export default function BookingConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const appointment = state?.appointment;
  const service = state?.service;
  const org = state?.org;

  const start = appointment ? dayjs(appointment.startTime) : null;

  return (
    <>
      <Nav />

      <div className="booking-confirmed-page">
        <div className="booking-confirmed__container">
          {!appointment ? (
            <div className="booking-confirmed__content">
              <h2>{t("booking.confirmed.errorTitle")}</h2>
              <Button onClick={() => navigate("/")}>
                {t("booking.confirmed.goHome")}
              </Button>
            </div>
          ) : (
            <div className="booking-confirmed__content">
              <h1 className="booking-confirmed__title">
                {t("booking.confirmed.title")}
              </h1>

              <p className="booking-confirmed__subtitle">
                {t("booking.confirmed.subtitle")}
              </p>

              <div className="booking-confirmed__details">
                <div>
                  <strong>{t("booking.confirmed.service")}:</strong>{" "}
                  {service?.name}
                </div>

                <div>
                  <strong>{t("booking.confirmed.date")}:</strong>{" "}
                  {start?.format("MMMM D, YYYY")}
                </div>

                <div>
                  <strong>{t("booking.confirmed.time")}:</strong>{" "}
                  {start?.format("h:mm A")}
                </div>

                <div>
                  <strong>{t("booking.confirmed.clinic")}:</strong> {org?.name}
                </div>
              </div>

              <p className="booking-confirmed__note">
                {t("booking.confirmed.note")}
              </p>

              <div className="booking-confirmed__actions">
                <Button type="primary" onClick={() => navigate("/demo")}>
                  {t("booking.confirmed.done")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
