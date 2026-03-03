import {
  Modal,
  Form,
  Select,
  DatePicker,
  Button,
  Radio,
  Input,
  message,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "./../../../../shared/api/axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AvailabilitySlot {
  start: string;
  end: string;
  displayStart: string;
  displayEnd: string;
}

export default function CreateAppointmentModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();

  const selectedServiceId = Form.useWatch(["appointment", "serviceId"], form);

  const selectedDate = Form.useWatch(["appointment", "date"], form);

  const selectedSpecialistId = Form.useWatch(
    ["appointment", "specialistId"],
    form,
  );

  const [clientMode, setClientMode] = useState("existing");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { user, organization } = useAuth();

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [specialists, setSpecialists] = useState<any[]>([]);
  const [specialistsLoading, setSpecialistsLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  useEffect(() => {
    if (!selectedServiceId || !selectedDate) {
      setSelectedTime(null);
      setAvailability([]);
      return;
    }

    if (
      organization?.schedulingMode === "specialist" &&
      !selectedSpecialistId
    ) {
      setSelectedTime(null);
      setAvailability([]);
      return;
    }

    setSelectedTime(null);
    setAvailability([]);

    fetchAvailability();
  }, [selectedServiceId, selectedSpecialistId, selectedDate]);

  useEffect(() => {
    if (!open) return;

    const fetchServices = async () => {
      try {
        setServicesLoading(true);

        const res = await axios.get("/services");

        setServices(res.data.data.services);
      } catch (err) {
        message.error(t("appointments.create.messages.servicesFailed"));
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchSpecialists = async () => {
      try {
        setSpecialistsLoading(true);

        const res = await axios.get("/organizations/employees");

        const allEmployees = res.data.data.employees;

        const onlySpecialists = allEmployees.filter(
          (emp: any) => emp.role === "specialist",
        );

        setSpecialists(onlySpecialists);
      } catch (err) {
        message.error(t("appointments.create.messages.specialistsFailed"));
      } finally {
        setSpecialistsLoading(false);
      }
    };

    const fetchPatients = async () => {
      try {
        setPatientsLoading(true);

        const res = await axios.get("/patients");

        setPatients(res.data.data.patients);
      } catch (err) {
        message.error(t("appointments.create.messages.patientsFailed"));
      } finally {
        setPatientsLoading(false);
      }
    };

    fetchPatients();
    fetchSpecialists();
    fetchServices();
  }, [open]);

  const fetchAvailability = async () => {
    try {
      setAvailabilityLoading(true);

      const ownerType = organization?.schedulingMode;

      const ownerId =
        ownerType === "organization"
          ? user?.organizationId
          : selectedSpecialistId;

      const res = await axios.get("/appointments/availability", {
        params: {
          ownerType,
          ownerId,
          date: selectedDate.format("YYYY-MM-DD"),
          serviceId: selectedServiceId,
        },
      });

      const slots: AvailabilitySlot[] = Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const now = dayjs();
      const isToday = selectedDate.isSame(now, "day");

      const filteredSlots = isToday
        ? slots.filter((slot) => dayjs(slot.start).isAfter(now))
        : slots;

      setAvailability(filteredSlots);
    } catch (err) {
      message.error(t("appointments.create.messages.availabilityFailed"));
    } finally {
      setAvailabilityLoading(false);
    }
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedTime) {
        message.error(t("appointments.create.messages.timeRequired"));
        return;
      }

      setLoading(true);

      const payload: any = {
        appointment: {
          ...values.appointment,
          date: values.appointment.date.format("YYYY-MM-DD"),
          startTime: selectedTime,
        },
      };

      if (clientMode === "existing") {
        payload.clientId = values.clientId;
      }

      if (clientMode === "guest") {
        payload.guestClient = values.guestClient;
      }

      if (clientMode === "newUser") {
        payload.createUser = true;
        payload.newUser = values.newUser;
      }

      await axios.post("/appointments/book-for-client", payload);

      message.success(t("appointments.create.messages.success"));

      onSuccess();
      onClose();
      form.resetFields();
      setSelectedTime(null);
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          t("appointments.create.messages.failed"),
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
        <Button
          key="create"
          type="primary"
          loading={loading}
          disabled={
            !selectedServiceId || !selectedDate || !selectedTime || loading
          }
          onClick={handleSubmit}
        >
          {t("appointments.create.submit")}
        </Button>,
      ]}
      title={t("appointments.create.title")}
      width={700}
    >
      <Form layout="vertical" form={form}>
        {/* Step 1: Client Mode */}
        <Form.Item label={t("appointments.create.clientType")}>
          <Radio.Group
            value={clientMode}
            onChange={(e) => setClientMode(e.target.value)}
          >
            <Radio value="existing">
              {t("appointments.create.clientTypeOptions.existing")}
            </Radio>

            <Radio value="newUser">
              {t("appointments.create.clientTypeOptions.newUser")}
            </Radio>

            <Radio value="guest">
              {t("appointments.create.clientTypeOptions.guest")}
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Conditional Fields */}
        {clientMode === "existing" && (
          <Form.Item
            name="clientId"
            label={t("appointments.create.fields.selectClient")}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              loading={patientsLoading}
              placeholder={t("appointments.create.fields.selectClient")}
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {patients.map((patient) => (
                <Select.Option
                  key={patient.id}
                  value={patient.id}
                  label={`${patient.firstName} ${patient.lastName} (${patient.email})`}
                >
                  {patient.firstName} {patient.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {clientMode === "newUser" && (
          <>
            <Form.Item
              name={["newUser", "firstName"]}
              label={t("appointments.create.fields.firstName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={["newUser", "lastName"]}
              label={t("appointments.create.fields.lastName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={["newUser", "email"]}
              label={t("appointments.create.fields.email")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {clientMode === "guest" && (
          <>
            <Form.Item
              name={["guestClient", "firstName"]}
              label={t("appointments.create.fields.firstName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={["guestClient", "lastName"]}
              label={t("appointments.create.fields.lastName")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name={["guestClient", "email"]}
              label={t("appointments.create.fields.email")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {/* Service Selection */}
        <Form.Item
          name={["appointment", "serviceId"]}
          label={t("appointments.create.fields.service")}
          rules={[{ required: true }]}
        >
          <Select
            loading={servicesLoading}
            placeholder={t("appointments.create.fields.service")}
          >
            {services.map((service) => (
              <Select.Option key={service.id} value={service.id}>
                {service.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Specialist Selection */}
        {organization?.schedulingMode === "specialist" && (
          <Form.Item
            name={["appointment", "specialistId"]}
            label={t("appointments.create.fields.specialist")}
            rules={[{ required: true }]}
          >
            <Select
              loading={specialistsLoading}
              placeholder={t("appointments.create.fields.specialist")}
            >
              {specialists.map((spec) => (
                <Select.Option key={spec.id} value={spec.id}>
                  {spec.firstName} {spec.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Date */}
        <Form.Item
          name={["appointment", "date"]}
          label={t("appointments.create.fields.date")}
          rules={[{ required: true }]}
        >
          <DatePicker />
        </Form.Item>

        {/* Time slot selection */}
        <Form.Item label={t("appointments.create.fields.time")} required>
          <Select
            loading={availabilityLoading}
            disabled={!availability.length || availabilityLoading}
            value={selectedTime}
            onChange={setSelectedTime}
            placeholder={t("appointments.create.fields.time")}
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
