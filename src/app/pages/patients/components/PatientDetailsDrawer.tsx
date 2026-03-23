import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import axios from "./../../../../shared/api/axios";
import type { Patient } from "./../Patients";

const { Title, Text, Paragraph } = Typography;

interface Props {
  open: boolean;
  patientId: number | null;
  onClose: () => void;
  onBookAppointment?: (patient: Patient) => void;
  onViewAppointment?: (patient: Patient) => void;
}

export default function PatientDetailsDrawer({
  open,
  patientId,
  onClose,
  onBookAppointment,
  onViewAppointment
}: Props) {
  const { t } = useTranslation();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPatient = async (id: number) => {
    try {
      setLoading(true);
      const res = await axios.get(`/patients/${id}`);
      setPatient(res.data?.data?.patient || null);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          t("patients.messages.detailLoadError"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && patientId) {
      fetchPatient(patientId);
    }
  }, [open, patientId]);

  const fullName = useMemo(() => {
    if (!patient) return "";
    return `${patient.firstName} ${patient.lastName}`;
  }, [patient]);

  const formattedAddress = useMemo(() => {
    if (!patient?.clientProfile) return null;

    const { streetAddress, city, state, zipcode } = patient.clientProfile;

    const parts = [
      streetAddress,
      [city, state].filter(Boolean).join(", "),
      zipcode,
    ].filter(Boolean);

    return parts.length ? parts.join(" ") : null;
  }, [patient]);

  const emergencyContact = patient?.clientProfile?.emergencyContact;

  return (
    <Drawer
      title={t("patients.drawer.title")}
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>{t("common.close")}</Button>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => {
              if (patient && onBookAppointment) {
                onBookAppointment(patient);
              }
            }}
          >
            {t("patients.actions.bookAppointment")}
          </Button>
        </Space>
      }
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : !patient ? (
        <Empty description={t("patients.empty.detail")} />
      ) : (
        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
          <Card className="patient-profile-hero">
            <Space align="start" size={16} style={{ width: "100%" }}>
              <Avatar
                size={72}
                src={patient.profilePicture || undefined}
                icon={<UserOutlined />}
              />
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {fullName}
                </Title>

                <Space wrap size={[8, 8]} style={{ marginTop: 8 }}>
                  {patient.clientProfile?.gender ? (
                    <Tag>{patient.clientProfile.gender}</Tag>
                  ) : null}

                  {patient.clientProfile?.preferredPronouns ? (
                    <Tag color="default">
                      {patient.clientProfile.preferredPronouns}
                    </Tag>
                  ) : null}

                  {patient.clientProfile?.preferredCommunication ? (
                    <Tag color="processing">
                      {patient.clientProfile.preferredCommunication}
                    </Tag>
                  ) : null}

                  {patient.clientProfile?.activityLevel ? (
                    <Tag color="success">
                      {patient.clientProfile.activityLevel}
                    </Tag>
                  ) : null}
                </Space>

                <Space
                  orientation="vertical"
                  size={4}
                  style={{ marginTop: 12, width: "100%" }}
                >
                  <Space size={8}>
                    <MailOutlined />
                    <Text>{patient.email}</Text>
                  </Space>

                  <Space size={8}>
                    <PhoneOutlined />
                    <Text>{patient.phone || t("common.notAvailable")}</Text>
                  </Space>
                </Space>
              </div>
            </Space>
          </Card>

          <Card title={t("patients.sections.personalInfo")}>
            <Descriptions column={2} size="middle" labelStyle={{ width: 180 }}>
              <Descriptions.Item label={t("patients.fields.dateOfBirth")}>
                {patient.clientProfile?.dob
                  ? dayjs(patient.clientProfile.dob).format("MMM D, YYYY")
                  : t("common.notAvailable")}
              </Descriptions.Item>

              <Descriptions.Item label={t("patients.fields.occupation")}>
                {patient.clientProfile?.occupation || t("common.notAvailable")}
              </Descriptions.Item>

              <Descriptions.Item label={t("patients.fields.gender")}>
                {patient.clientProfile?.gender || t("common.notAvailable")}
              </Descriptions.Item>

              <Descriptions.Item label={t("patients.fields.pronouns")}>
                {patient.clientProfile?.preferredPronouns ||
                  t("common.notAvailable")}
              </Descriptions.Item>

              <Descriptions.Item
                label={t("patients.fields.preferredCommunication")}
              >
                {patient.clientProfile?.preferredCommunication ||
                  t("common.notAvailable")}
              </Descriptions.Item>

              <Descriptions.Item label={t("patients.fields.referralSource")}>
                {patient.clientProfile?.referralSource ||
                  t("common.notAvailable")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t("patients.sections.address")}>
            <Descriptions column={1} size="middle">
              <Descriptions.Item label={t("patients.fields.address")}>
                {formattedAddress || t("common.notAvailable")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t("patients.sections.emergencyContact")}>
            {emergencyContact ? (
              <Descriptions column={1} size="middle">
                <Descriptions.Item label={t("patients.fields.contactName")}>
                  {emergencyContact.name || t("common.notAvailable")}
                </Descriptions.Item>
                <Descriptions.Item label={t("patients.fields.relationship")}>
                  {emergencyContact.relationship || t("common.notAvailable")}
                </Descriptions.Item>
                <Descriptions.Item label={t("patients.fields.contactPhone")}>
                  {emergencyContact.phone || t("common.notAvailable")}
                </Descriptions.Item>
                <Descriptions.Item label={t("patients.fields.contactEmail")}>
                  {emergencyContact.email || t("common.notAvailable")}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("patients.empty.emergencyContact")}
              />
            )}
          </Card>

          <Card title={t("patients.sections.medicalInfo")}>
            <Descriptions column={1} size="middle">
              <Descriptions.Item label={t("patients.fields.activityLevel")}>
                {patient.clientProfile?.activityLevel ||
                  t("common.notAvailable")}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <Text strong>{t("patients.fields.medicalNotes")}</Text>
              <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                {patient.clientProfile?.medicalNotes ||
                  t("common.notAvailable")}
              </Paragraph>
            </div>
          </Card>

          <Card title={t("patients.sections.quickActions")}>
            <Space wrap>
              <Button type="primary" icon={<CalendarOutlined />}>
                {t("patients.actions.bookAppointment")}
              </Button>

              <Button icon={<CalendarOutlined />} onClick={() => onViewAppointment?.(patient)}>
                {t("patients.actions.viewAppointments")}
              </Button>
            </Space>
          </Card>
        </Space>
      )}
    </Drawer>
  );
}
