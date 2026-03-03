import { useEffect, useState } from "react";
import { Tabs, Button, message, Empty, Spin, Modal } from "antd";
import PageLayout from "../../layout/PageLayout";
import api from "../../../shared/api/axios";
import WeeklyAvailabilityTable from "./components/WeeklyAvailabilityTable";
import AvailabilityEditorModal from "./components/AvailabilityEditorModal";
import OverridesTable from "./components/OverridesTable";
import OverrideModal from "./components/OverrideModal";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";
import { useTranslation } from "react-i18next";

export default function Schedule() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("availability");
  const [schedule, setSchedule] = useState<any | null>(null);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingOverrides, setLoadingOverrides] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);

  const { user, organization } = useAuth();

  const canManageSchedule = () => {
    if (!user || !organization) return false;

    if (organization.schedulingMode === "organization") {
      return (
        can(user.role, "manage:schedule") &&
        (user.role === "clinicAdmin" || user.role === "freelanceAdmin")
      );
    }

    if (organization.schedulingMode === "specialist") {
      return can(user.role, "manage:schedule");
    }

    return false;
  };

  useEffect(() => {
    fetchSchedule();
    fetchOverrides();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoadingSchedule(true);
      const res = await api.get("/schedules");
      setSchedule(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSchedule(null);
      } else {
        message.error(t("schedule.messages.loadScheduleError"));
      }
    } finally {
      setLoadingSchedule(false);
    }
  };

  const fetchOverrides = async () => {
    try {
      setLoadingOverrides(true);
      const res = await api.get("/schedules/schedule-overrides");
      setOverrides(res.data.data);
    } catch {
      message.error(t("schedule.messages.loadOverridesError"));
    } finally {
      setLoadingOverrides(false);
    }
  };

  const renderPrimaryAction = () => {
    if (!canManageSchedule()) return null;

    if (activeTab === "availability") {
      return (
        <Button type="primary" onClick={() => setEditorOpen(true)}>
          {schedule
            ? t("schedule.actions.editAvailability")
            : t("schedule.actions.setAvailability")}
        </Button>
      );
    }

    return (
      <Button type="primary" onClick={() => setOverrideOpen(true)}>
        {t("schedule.actions.createOverride")}
      </Button>
    );
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: t("schedule.overrides.deleteTitle"),
      content: t("schedule.overrides.deleteConfirm"),
      okText: t("common.delete"),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.delete(`/schedules/schedule-overrides/${id}`);
          message.success(t("schedule.messages.overrideDeleted"));
          fetchOverrides();
        } catch {
          message.error(t("schedule.messages.deleteOverrideError"));
        }
      },
    });
  };

  return (
    <PageLayout
      title={t("schedule.title")}
      subtitle={t("schedule.subtitle")}
      primaryAction={renderPrimaryAction()}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "availability",
            label: t("schedule.tabs.availability"),
            children: (
              <div style={{ padding: 24 }}>
                {loadingSchedule ? (
                  <Spin />
                ) : schedule ? (
                  <div>
                    <WeeklyAvailabilityTable
                      weeklyPattern={schedule.weeklyPattern}
                    />
                  </div>
                ) : (
                  <Empty
                    description={t("schedule.empty.noAvailability")}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    {canManageSchedule() && (
                      <Button
                        type="primary"
                        onClick={() => setEditorOpen(true)}
                      >
                        {t("schedule.actions.setAvailability")}
                      </Button>
                    )}
                  </Empty>
                )}
              </div>
            ),
          },
          {
            key: "overrides",
            label: t("schedule.tabs.overrides"),
            children: (
              <div style={{ padding: 24 }}>
                {loadingOverrides ? (
                  <Spin />
                ) : overrides.length > 0 ? (
                  <div>
                    <OverridesTable
                      overrides={overrides}
                      loading={loadingOverrides}
                      onDelete={canManageSchedule() ? handleDelete : undefined}
                    />
                  </div>
                ) : (
                  <Empty
                    description={t("schedule.empty.noOverrides")}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    {canManageSchedule() && (
                      <Button
                        type="primary"
                        onClick={() => setOverrideOpen(true)}
                      >
                        {t("schedule.actions.createOverride")}
                      </Button>
                    )}
                  </Empty>
                )}
              </div>
            ),
          },
        ]}
      />
      <AvailabilityEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        initialPattern={schedule?.weeklyPattern || null}
        onSave={async (pattern) => {
          try {
            if (schedule) {
              await api.patch(`/schedules/${schedule.id}`, {
                weeklyPattern: pattern,
              });
            } else {
              await api.post("/schedules", {
                weeklyPattern: pattern,
              });
            }

            setEditorOpen(false);
            fetchSchedule();
          } catch {
            message.error(t("schedule.messages.saveError"));
          }
        }}
      />

      <OverrideModal
        open={overrideOpen}
        onClose={() => setOverrideOpen(false)}
        onSave={async (data) => {
          try {
            await api.post("/schedules/schedule-overrides", data);
            message.success(t("schedule.messages.overrideCreated"));
            setOverrideOpen(false);
            fetchOverrides();
          } catch {
            message.error(t("schedule.messages.createOverrideError"));
          }
        }}
      />
    </PageLayout>
  );
}
