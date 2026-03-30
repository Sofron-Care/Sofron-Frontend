import { useEffect, useState, useCallback } from "react";
import axios from "./../../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { message, Modal } from "antd";
import { useNavigate } from "react-router-dom";

import AppointmentCard from "../shared/AppointmentCard";
import RescheduleAppointmentModal from "../../../appointments/components/RescheduleAppointmentModal";

import type { Appointment } from "../../../appointments/types";

/* =========================
   API RESPONSE TYPE (NO ANY)
========================= */
interface AppointmentApi {
  id: number;
  startTime: string;
  endTime: string;
  status: string;

  serviceBooked?: {
    id: number;
    name: string;
    duration: number;
  };

  organization?: {
    id: number;
    name: string;
    timeZone: string;
  };

  specialist?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface AppointmentResponse {
  data: {
    appointments: AppointmentApi[];
  };
}

/* =========================
   MAPPER (API → APP TYPE)
========================= */
const mapAppointment = (appt: AppointmentApi): Appointment => ({
  id: String(appt.id), // ✅ modal expects string
  publicId: String(appt.id), // temp fallback
  organizationId: appt.organization?.id ?? 0,

  status: appt.status as Appointment["status"],

  date: appt.startTime, // fallback until backend adds real date

  startTime: appt.startTime,
  endTime: appt.endTime,

  serviceBooked: appt.serviceBooked,
  specialist: appt.specialist,
});

export default function AppointmentsTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [past, setPast] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* =========================
     FETCH
  ========================= */
  const fetchAppointments = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      const [upcomingRes, pastRes] = await Promise.all([
        axios.get<AppointmentResponse>("/appointments/me?filter=upcoming"),
        axios.get<AppointmentResponse>("/appointments/me?filter=past"),
      ]);

      setUpcoming(
        upcomingRes.data.data.appointments.map(mapAppointment)
      );

      setPast(
        pastRes.data.data.appointments.map(mapAppointment)
      );
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  /* =========================
     ACTIONS
  ========================= */
  const handleCancel = (appointment: Appointment) => {
    Modal.confirm({
      title: t("clientDashboard.confirmCancelTitle"),
      content: t("clientDashboard.confirmCancelMessage"),
      onOk: async () => {
        try {
          await axios.patch(
            `/appointments/${Number(appointment.id)}/cancel`
          );

          message.success(t("clientDashboard.messages.cancelSuccess"));
          fetchAppointments();
        } catch {
          message.error(t("clientDashboard.messages.cancelError"));
        }
      },
    });
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  const handleBookAgain = (appointment: Appointment) => {
    const orgId = appointment.organizationId;
    const serviceId = appointment.serviceBooked?.id;

    if (!orgId || !serviceId) return;

    navigate(`/booking/${orgId}?serviceId=${serviceId}`);
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <p>{t("common.loading")}</p>;
  }

  return (
    <div className="client-dashboard__section">
      {/* UPCOMING */}
      <h3>{t("clientDashboard.sections.upcoming")}</h3>

      {upcoming.length === 0 ? (
        <p>{t("clientDashboard.noUpcoming")}</p>
      ) : (
        upcoming.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            type="upcoming"
            onCancel={handleCancel}
            onReschedule={handleReschedule}
          />
        ))
      )}

      {/* PAST */}
      <h3>{t("clientDashboard.sections.pastAppointments")}</h3>

      {past.length === 0 ? (
        <p>{t("clientDashboard.noPast")}</p>
      ) : (
        past.map((appt) => (
          <AppointmentCard
            key={appt.id}
            appointment={appt}
            type="past"
            onBookAgain={handleBookAgain}
          />
        ))
      )}

      {/* RESCHEDULE MODAL */}
      <RescheduleAppointmentModal
        open={modalOpen}
        appointment={selectedAppointment}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchAppointments();
        }}
      />
    </div>
  );
}