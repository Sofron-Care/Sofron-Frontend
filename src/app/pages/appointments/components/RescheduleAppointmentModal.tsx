import { Modal, Form, DatePicker, Select, message } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import type { Appointment } from "../types";

interface AvailabilitySlot {
  start: string;
  end: string;
  displayStart: string;
  displayEnd: string;
}

interface Props {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RescheduleAppointmentModal({
  open,
  appointment,
  onClose,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedDate = Form.useWatch("date", form);

  useEffect(() => {
    if (!open || !appointment) return;
    form.resetFields();
    setSelectedTime(null);
    setAvailability([]);
  }, [open, appointment]);

  useEffect(() => {
    if (!selectedDate || !appointment) return;

    fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    if (!appointment || !selectedDate) return;
    try {
      setAvailabilityLoading(true);

      const ownerType = appointment.specialist?.id
        ? "specialist"
        : "organization";

      const ownerId = appointment.specialist?.id || appointment.organizationId;

      const res = await axios.get("/appointments/availability", {
        params: {
          ownerType,
          ownerId,
          date: selectedDate.format("YYYY-MM-DD"),
          serviceId: appointment.serviceBooked?.id,
        },
      });

      const slots: AvailabilitySlot[] = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const now = dayjs();
      const isToday = selectedDate.isSame(now, "day");

      const filtered = isToday
        ? slots.filter((slot) => dayjs(slot.start).isAfter(now))
        : slots;

      setAvailability(filtered);
    } catch {
      message.error(t("appointments.reschedule.messages.availabilityFailed"));
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!appointment || !selectedTime) {
      message.error(t("appointments.reschedule.messages.timeRequired"));
      return;
    }

    try {
      setLoading(true);

      await axios.patch(`/appointments/${appointment.id}/reschedule`, {
        date: selectedDate.format("YYYY-MM-DD"),
        startTime: selectedTime,
      });

      message.success(t("appointments.reschedule.messages.success"));
      onSuccess();
      onClose();
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          t("appointments.reschedule.messages.failed"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      title={t("appointments.reschedule.title")}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="date"
          label={t("appointments.reschedule.fields.date")}
          rules={[{ required: true }]}
        >
          <DatePicker
            disabledDate={(current) =>
              current && current.isBefore(dayjs().startOf("day"))
            }
          />
        </Form.Item>

        <Form.Item label={t("appointments.reschedule.fields.time")} required>
          <Select
            loading={availabilityLoading}
            disabled={!availability.length}
            value={selectedTime}
            onChange={setSelectedTime}
          >
            {availability.map((slot) => (
              <Select.Option key={slot.start} value={slot.start}>
                {dayjs(slot.start).format("h:mm A")}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
