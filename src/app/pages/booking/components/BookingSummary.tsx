import { useTranslation } from "react-i18next";
import { formatTimeRange } from "../../../utils/time";

type Props = {
  organization: {
    name: string;
  };
  booking: {
    serviceName: string;
    specialistName: string;
    date: string;
    timeStart: string;
    timeEnd: string;
    duration: number | null;
    price: number | string | null;
  };
};

export default function BookingSummary({ organization, booking }: Props) {
  const { t } = useTranslation();

  const fallback = t("common.notAvailable");

  return (
    <aside className="booking-summary">
      <div className="booking-summary__card">
        <h3 className="booking-summary__title">{t("booking.summary.title")}</h3>

        <div className="booking-summary__row">
          <span>
            {t("booking.summary.service") === "Service" ? "Clinic" : "Clinic"}
          </span>
          <strong>{organization.name}</strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.service")}</span>
          <strong>{booking.serviceName || fallback}</strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.specialist")}</span>
          <strong>{booking.specialistName || fallback}</strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.date")}</span>
          <strong>{booking.date || fallback}</strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.time")}</span>
          <strong>
            {booking.timeStart && booking.timeEnd
              ? formatTimeRange(booking.timeStart, booking.timeEnd)
              : fallback}
          </strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.duration")}</span>
          <strong>
            {booking.duration
              ? `${booking.duration} ${t("common.minutes", { defaultValue: "min" })}`
              : fallback}
          </strong>
        </div>

        <div className="booking-summary__row">
          <span>{t("booking.summary.price")}</span>
          <strong>
            {booking.price !== null && booking.price !== undefined
              ? typeof booking.price === "number"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(booking.price)
                : booking.price
              : fallback}
          </strong>
        </div>
      </div>
    </aside>
  );
}
