import {
  Avatar,
  Button,
  Card,
  Empty,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useMemo, useState } from "react";
import { UserOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "./../../../shared/api/axios";
import PageLayout from "./../../layout/PageLayout";
import PatientDetailsDrawer from "./components/PatientDetailsDrawer";
import CreateAppointmentModal from "../appointments/components/CreateAppointmentModal";
import PatientAppointmentsDrawer from "./components/PatientAppointmentsDrawer";

const { Text } = Typography;

export interface PatientProfile {
  dob?: string | null;
  gender?: string | null;
  preferredPronouns?: string | null;
  occupation?: string | null;
  preferredCommunication?: string | null;
  activityLevel?: string | null;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  } | null;
  medicalNotes?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
  referralSource?: string | null;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  profilePicture?: string | null;
  clientProfile?: PatientProfile | null;
}

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

export default function PatientsPage() {
  const { t } = useTranslation();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null,
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [appointmentsPatient, setAppointmentsPatient] =
    useState<Patient | null>(null);

  const fetchPatients = async (query?: string) => {
    try {
      setLoading(true);

      const endpoint =
        query && query.trim().length > 0
          ? `/patients/search?q=${encodeURIComponent(query.trim())}`
          : "/patients";

      const res = await axios.get(endpoint);
      setPatients(res.data?.data?.patients || []);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || t("patients.messages.loadError"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(debouncedSearch);
  }, [debouncedSearch]);

  const openPatient = (patientId: number) => {
    setSelectedPatientId(patientId);
    setDrawerOpen(true);
  };

  const columns: ColumnsType<Patient> = useMemo(
    () => [
      {
        title: t("patients.table.patient"),
        key: "patient",
        sorter: (a, b) =>
          `${a.lastName} ${a.firstName}`.localeCompare(
            `${b.lastName} ${b.firstName}`,
          ),
        render: (_, record) => (
          <Space size={12}>
            <Avatar
              size={44}
              src={record.profilePicture || undefined}
              icon={<UserOutlined />}
            />
            <div>
              <Text strong className="table-primary-text">
                {record.firstName} {record.lastName}
              </Text>
              <div>
                <Text type="secondary" className="table-secondary-text">
                  {record.email}
                </Text>
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: t("patients.table.phone"),
        dataIndex: "phone",
        key: "phone",
        render: (value: string | null | undefined) =>
          value ? (
            <Text>{value}</Text>
          ) : (
            <Text type="secondary">{t("common.notAvailable")}</Text>
          ),
      },
      {
        title: t("patients.table.gender"),
        key: "gender",
        render: (_, record) =>
          record.clientProfile?.gender ? (
            <Tag>{record.clientProfile.gender}</Tag>
          ) : (
            <Text type="secondary">{t("common.notAvailable")}</Text>
          ),
      },
      {
        title: t("patients.table.pronouns"),
        key: "preferredPronouns",
        render: (_, record) =>
          record.clientProfile?.preferredPronouns ? (
            <Text>{record.clientProfile.preferredPronouns}</Text>
          ) : (
            <Text type="secondary">{t("common.notAvailable")}</Text>
          ),
      },
      {
        title: t("patients.table.preferredCommunication"),
        key: "preferredCommunication",
        render: (_, record) =>
          record.clientProfile?.preferredCommunication ? (
            <Tag color="default">
              {record.clientProfile.preferredCommunication}
            </Tag>
          ) : (
            <Text type="secondary">{t("common.notAvailable")}</Text>
          ),
      },
      {
        title: t("patients.table.actions"),
        key: "actions",
        width: 180,
        render: (_, record) => (
          <Space size={8}>
            <Button
              icon={<EyeOutlined />}
              onClick={() => openPatient(record.id)}
            >
              {t("patients.actions.view")}
            </Button>
          </Space>
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <PageLayout
        title={t("patients.title")}
        secondaryActions={
          <Input.Search
            placeholder={t("patients.searchPlaceholder")}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
        }
      >
        <Card className="content-card">
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={patients}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    search.trim()
                      ? t("patients.empty.search")
                      : t("patients.empty.default")
                  }
                />
              ),
            }}
            scroll={{ x: 700 }}
          />
        </Card>
      </PageLayout>

      <PatientDetailsDrawer
        open={drawerOpen}
        patientId={selectedPatientId}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedPatientId(null);
        }}
        onBookAppointment={(patient) => {
          setSelectedPatient(patient);
          setCreateOpen(true);
        }}
        onViewAppointment={(patient) => {
          setAppointmentsPatient(patient);
          setAppointmentsOpen(true);
        }}
      />

      <CreateAppointmentModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setSelectedPatient(null);
        }}
        onSuccess={() => {
          setCreateOpen(false);
          setSelectedPatient(null);
        }}
        initialValues={
          selectedPatient
            ? {
                clientId: selectedPatient.id,
              }
            : undefined
        }
      />

      <PatientAppointmentsDrawer
        open={appointmentsOpen}
        patientId={appointmentsPatient?.id || null}
        patientName={
          appointmentsPatient
            ? `${appointmentsPatient.firstName} ${appointmentsPatient.lastName}`
            : ""
        }
        onClose={() => {
          setAppointmentsOpen(false);
          setAppointmentsPatient(null);
        }}
      />
    </>
  );
}
