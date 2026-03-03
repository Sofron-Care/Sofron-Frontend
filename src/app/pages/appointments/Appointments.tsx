import { Button, DatePicker, Segmented, Select, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";
import PageLayout from "../../layout/PageLayout";
import AppointmentTable from "./components/AppointmentTable";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import axios from "./../../../shared/api/axios";
import type { Appointment } from "./types";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import CreateAppointmentModal from "./components/CreateAppointmentModal";
import RescheduleAppointmentModal from "./components/RescheduleAppointmentModal";

const { RangePicker } = DatePicker;

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const canCreate = can(user?.role, "create:appointment");

  const [range, setRange] = useState<[any, any]>([
    dayjs().startOf("week"),
    dayjs().endOf("week"),
  ]);

  const [view, setView] = useState(
    user?.role === "specialist" ? "mine" : "all",
  );

  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(
    null,
  );

  const fetchAppointments = async () => {
    if (!range) return;

    try {
      setLoading(true);

      const start = range[0].format("YYYY-MM-DD");
      const end = range[1].format("YYYY-MM-DD");

      const res = await axios.get("/appointments/range", {
        params: { start, end },
      });

      setAppointments(res.data.data.appointments);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [range]);

  const updateAppointmentStatus = (
    id: string,
    status: Appointment["status"],
  ) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
    );
  };

  const handleAppointmentAction = async (
    action: string,
    record: Appointment,
  ) => {
    try {
      setLoading(true);
      if (action === "reschedule") {
        setRescheduleTarget(record);
        setRescheduleOpen(true);
        return;
      }
      if (action === "checkin") {
        await axios.patch(`/appointments/${record.id}/checkin`);
        updateAppointmentStatus(record.id, "Checked-In");
        message.success(t("appointments.messages.checkedIn"));
      }

      if (action === "cancel") {
        await axios.patch(`/appointments/${record.id}/cancel`);
        updateAppointmentStatus(record.id, "Cancelled");
        message.success(t("appointments.messages.cancelled"));
      }

      if (action === "noshow") {
        await axios.patch(`/appointments/${record.id}/no-show`);
        updateAppointmentStatus(record.id, "No-Show");
        message.success(t("appointments.messages.noShow"));
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || t("appointments.messages.actionFailed"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (text: string) => {
    if (!selectedAppointment) return;

    try {
      const res = await axios.patch(
        `/appointments/${selectedAppointment.id}/notes`,
        { note: text },
      );

      setSelectedAppointment((prev) =>
        prev ? { ...prev, notes: res.data.data.notes } : prev,
      );

      message.success(t("appointments.notes.added"));
    } catch (err: any) {
      message.error(err?.response?.data?.message);
    }
  };

  const openDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);

      const res = await axios.get(`/appointments/${id}`);

      const appt = res.data.data.appointment;

      const normalized = {
        ...appt,
        id: String(appt.id),
        specialist: appt.specialist
          ? { ...appt.specialist, id: String(appt.specialist.id) }
          : undefined,
        client: appt.client
          ? { ...appt.client, id: String(appt.client.id) }
          : undefined,
        guestClient: appt.guestClient
          ? { ...appt.guestClient, id: String(appt.guestClient.id) }
          : undefined,
      };

      setSelectedAppointment(normalized);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to load details");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <PageLayout
      title={t("appointments.title")}
      primaryAction={
        canCreate ? (
          <Button
            type="primary"
            disabled={loading}
            onClick={() => setCreateOpen(true)}
          >
            {t("appointments.create.title")}
          </Button>
        ) : null
      }
      secondaryActions={
        <>
          <RangePicker
            value={range}
            onChange={(value) => {
              if (value) setRange(value as any);
            }}
          />

          <Segmented
            options={[
              { label: t("appointments.filters.viewAll"), value: "all" },
              { label: t("appointments.filters.viewMine"), value: "mine" },
            ]}
            value={view}
            onChange={(val) => setView(val)}
          />

          <Select
            placeholder={t("appointments.filters.status")}
            style={{ width: 160 }}
            allowClear
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={[
              { label: t("appointments.status.Scheduled"), value: "Scheduled" },
              {
                label: t("appointments.status.Checked-In"),
                value: "Checked-In",
              },
              { label: t("appointments.status.Completed"), value: "Completed" },
              { label: t("appointments.status.Cancelled"), value: "Cancelled" },
              { label: t("appointments.status.No-Show"), value: "No-Show" },
            ]}
          />

          <Input.Search
            placeholder={t("appointments.filters.search")}
            style={{ width: 240 }}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </>
      }
    >
      <div className="card card-table">
        <AppointmentTable
          appointments={appointments}
          loading={loading}
          view={view}
          statusFilter={statusFilter}
          search={search}
          onAction={handleAppointmentAction}
          onOpenDetails={openDetails}
        />
      </div>

      <AppointmentDetailsModal
        open={detailsOpen}
        loading={detailsLoading}
        appointment={selectedAppointment}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedAppointment(null);
        }}
        onAddNote={handleAddNote}
      />

      <CreateAppointmentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => {
          fetchAppointments();
        }}
      />
      <RescheduleAppointmentModal
        open={rescheduleOpen}
        appointment={rescheduleTarget}
        onClose={() => {
          setRescheduleOpen(false);
          setRescheduleTarget(null);
        }}
        onSuccess={fetchAppointments}
      />
    </PageLayout>
  );
}
