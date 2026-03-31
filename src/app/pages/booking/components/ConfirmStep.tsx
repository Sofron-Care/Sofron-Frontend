import { Button } from "antd";
import { formatTime } from "../../../utils/time";
type Props = {
  organization: {
    name: string;
  };
  booking: {
    serviceName: string;
    specialistName: string;
    date: string;
    timeStart: string;
    price: number | string | null;
    details: string;
  };
  onConfirm: () => void;
  onBack: () => void;
};

export default function ConfirmStep({
  organization,
  booking,
  onConfirm,
  onBack,
}: Props) {
  return (
    <div className="booking-panel">
      <h2 className="booking-panel__title">Confirm appointment</h2>

      <div className="booking-confirm-list">
        <div>
          <strong>Clinic:</strong> {organization.name}
        </div>
        <div>
          <strong>Service:</strong> {booking.serviceName || "---"}
        </div>
        <div>
          <strong>Specialist:</strong> {booking.specialistName || "---"}
        </div>
        <div>
          <strong>Date:</strong> {booking.date || "---"}
        </div>
        <div>
          <strong>Time:</strong> {formatTime(booking.timeStart) || "---"}
        </div>
        <div>
          <strong>Price:</strong> ${booking.price ?? "---"}
        </div>
        <div>
          <strong>Additional details:</strong> {booking.details || "---"}
        </div>
      </div>

      <div className="booking-confirm-actions">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={onConfirm}>
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
}
