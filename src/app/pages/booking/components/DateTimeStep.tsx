import { Button, DatePicker, Empty, Spin } from "antd";
import dayjs from "dayjs";
import { formatTimeRange } from "../../../utils/time";

type AvailabilitySlot = {
  start: string;
  end: string;
  displayStart: string;
  displayEnd: string;
};

type Props = {
  loading: boolean;
  availability: AvailabilitySlot[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onSlotSelect: (date: string, slot: AvailabilitySlot) => void;
};

export default function DateTimeStep({
  loading,
  availability,
  selectedDate,
  onDateChange,
  onSlotSelect,
}: Props) {
  return (
    <div className="booking-panel">
      <h2 className="booking-panel__title">Select date and time</h2>

      <div className="booking-datetime">
        <DatePicker
          value={selectedDate ? dayjs(selectedDate) : null}
          onChange={(date) => {
            if (!date) return;
            onDateChange(date.format("YYYY-MM-DD"));
          }}
        />

        {!selectedDate ? (
          <Empty description="Select a date to view availability" />
        ) : loading ? (
          <div className="booking-panel--loading">
            <Spin />
          </div>
        ) : availability.length === 0 ? (
          <Empty description="No availability for selected date" />
        ) : (
          <div className="booking-times">
            {availability.map((slot) => (
              <Button
                key={slot.start}
                onClick={() => onSlotSelect(selectedDate, slot)}
              >
                {formatTimeRange(slot.start, slot.end)}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
