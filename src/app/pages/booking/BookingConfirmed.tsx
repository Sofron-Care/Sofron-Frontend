import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import dayjs from "dayjs";

export default function BookingConfirmed() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appointment = state?.appointment;
  const service = state?.service;
  const org = state?.org;

  if (!appointment) {
    return (
      <div className="booking-panel">
        <h2>Something went wrong</h2>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </div>
    );
  }

  const start = dayjs(appointment.startTime);

  return (
    <div className="booking-panel booking-confirmed">
      <div className="booking-confirmed__content">
        <h1 className="booking-confirmed__title">Appointment Confirmed</h1>

        <p className="booking-confirmed__subtitle">
          Your appointment has been successfully booked.
        </p>

        <div className="booking-confirmed__details">
          <div>
            <strong>Service:</strong> {service?.name}
          </div>

          <div>
            <strong>Date:</strong> {start.format("MMMM D, YYYY")}
          </div>

          <div>
            <strong>Time:</strong> {start.format("h:mm A")}
          </div>

          <div>
            <strong>Clinic:</strong> {org?.name}
          </div>
        </div>

        <p className="booking-confirmed__note">
          A confirmation email has been sent with your appointment details.
        </p>

        <div className="booking-confirmed__actions">
          <Button type="primary" onClick={() => navigate("/")}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
