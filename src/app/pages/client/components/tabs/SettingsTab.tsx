import {
  Form,
  Input,
  Button,
  message,
  Card,
  DatePicker,
  Select,
  Spin,
} from "antd";
import { useAuth } from "../../../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "./../../../../../shared/api/axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default function SettingsTab() {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoadingProfile(true);
        const res = await axios.get("/users/me");
        const fetchedUser = res.data.data.user;

        setUser(fetchedUser);

        form.setFieldsValue({
          ...fetchedUser,
          ...(fetchedUser.clientProfile || {}),
          dob: fetchedUser.clientProfile?.dob
            ? dayjs(fetchedUser.clientProfile.dob)
            : null,
        });
      } catch {
        message.error(t("clientDashboard.messages.error"));
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchMe();
  }, [form, setUser, t]);

  /* =========================
     UPDATE PROFILE
  ========================= */
  const handleUpdate = async (values: any) => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        updateType: "clientProfile",
      };

      const res = await axios.patch("/users/me", payload);

      setUser(res.data.data.updatedUser);

      message.success(t("clientDashboard.settings.updated"));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };

  /* =========================
     SECURITY ACTIONS
  ========================= */
  const handleEmailChange = async () => {
    try {
      await axios.post("/auth/request-email-change");
      message.success(t("clientDashboard.settings.emailSent"));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };

  const handlePasswordReset = async () => {
    try {
      await axios.post("/auth/request-password-change");
      message.success(t("clientDashboard.settings.passwordSent"));
    } catch {
      message.error(t("clientDashboard.messages.error"));
    }
  };

  /* =========================
     INITIAL VALUES
  ========================= */
  const initialValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    phone: user?.phone,
  };

  return (
    <div className="client-dashboard__section client-dashboard__section--constrained">
      <h3 className="client-section-title">
        {t("clientDashboard.settings.title")}
      </h3>
      {loadingProfile ? (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleUpdate}
        >
          {/* ACCOUNT */}
          <Card
            className="client-settings-card"
            title={t("clientDashboard.settings.account")}
          >
            <Form.Item
              name="firstName"
              label={t("clientDashboard.settings.firstName")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="lastName"
              label={t("clientDashboard.settings.lastName")}
            >
              <Input />
            </Form.Item>

            <Form.Item name="phone" label={t("clientDashboard.settings.phone")}>
              <Input />
            </Form.Item>
          </Card>

          {/* PERSONAL */}
          <Card
            className="client-settings-card"
            title={t("clientDashboard.settings.personal")}
          >
            <Form.Item name="dob" label={t("clientDashboard.settings.dob")}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="gender"
              label={t("clientDashboard.settings.gender")}
            >
              <Select
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Nonbinary", label: "Nonbinary" },
                  { value: "Agender", label: "Agender" },
                  { value: "Genderqueer", label: "Genderqueer" },
                  { value: "GenderFluid", label: "Gender Fluid" },
                  { value: "Other", label: "Other" },
                  { value: "Prefer not to say", label: "Prefer not to say" },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="preferredPronouns"
              label={t("clientDashboard.settings.pronouns")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="occupation"
              label={t("clientDashboard.settings.occupation")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="activityLevel"
              label={t("clientDashboard.settings.activityLevel")}
            >
              <Select
                options={[
                  { value: "Sedentary", label: "Sedentary" },
                  { value: "Lightly Active", label: "Lightly Active" },
                  { value: "Active", label: "Active" },
                  { value: "Very Active", label: "Very Active" },
                ]}
              />
            </Form.Item>
          </Card>

          {/* ADDRESS */}
          <Card
            className="client-settings-card"
            title={t("clientDashboard.settings.address")}
          >
            <Form.Item
              name="streetAddress"
              label={t("clientDashboard.settings.street")}
            >
              <Input />
            </Form.Item>

            <Form.Item name="city" label={t("clientDashboard.settings.city")}>
              <Input />
            </Form.Item>

            <Form.Item name="state" label={t("clientDashboard.settings.state")}>
              <Input maxLength={2} />
            </Form.Item>

            <Form.Item
              name="zipcode"
              label={t("clientDashboard.settings.zipcode")}
            >
              <Input />
            </Form.Item>
          </Card>

          {/* MEDICAL */}
          <Card
            className="client-settings-card"
            title={t("clientDashboard.settings.medical")}
          >
            <Form.Item
              name="medicalNotes"
              label={t("clientDashboard.settings.medicalNotes")}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="referralSource"
              label={t("clientDashboard.settings.referral")}
            >
              <Input />
            </Form.Item>
          </Card>

          {/* SAVE */}
          <div className="client-settings-submit">
            <Button type="primary" htmlType="submit">
              {t("common.save")}
            </Button>
          </div>
        </Form>
      )}
      {/* SECURITY */}
      <Card
        className="client-settings-card client-settings-security"
        title={t("clientDashboard.settings.security")}
      >
        <div className="client-settings-actions">
          <Button onClick={handleEmailChange} className="client-settings-action-control">
            {t("clientDashboard.settings.changeEmail")}
          </Button>

          <Button onClick={handlePasswordReset}>
            {t("clientDashboard.settings.resetPassword")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
