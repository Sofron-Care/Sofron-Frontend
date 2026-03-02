import { useEffect, useState } from "react";
import { Tabs, Button, message, Empty, Spin, Modal } from "antd";
import PageLayout from "../../layout/PageLayout";
import api from "../../../shared/api/axios";
import WeeklyAvailabilityTable from "./components/WeeklyAvailabilityTable";
import AvailabilityEditorModal from "./components/AvailabilityEditorModal";
import OverridesTable from "./components/OverridesTable";
import OverrideModal from "./components/OverrideModal";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("availability");
  const [schedule, setSchedule] = useState<any | null>(null);
  const [overrides, setOverrides] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingOverrides, setLoadingOverrides] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);

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
        message.error("Failed to load schedule");
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
      message.error("Failed to load overrides");
    } finally {
      setLoadingOverrides(false);
    }
  };

  const renderPrimaryAction = () => {
    if (activeTab === "availability") {
      return (
        <Button type="primary" onClick={() => setEditorOpen(true)}>
          {schedule ? "Edit Availability" : "Set Availability"}
        </Button>
      );
    }

    return (
      <Button type="primary" onClick={() => setOverrideOpen(true)}>
        Create Override
      </Button>
    );
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Override",
      content: "Are you sure you want to delete this override?",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.delete(`/schedules/schedule-overrides/${id}`);
          message.success("Override deleted");
          fetchOverrides();
        } catch {
          message.error("Failed to delete override");
        }
      },
    });
  };

  return (
    <PageLayout
      title="Scheduling"
      subtitle="Manage your weekly availability and overrides"
      primaryAction={renderPrimaryAction()}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "availability",
            label: "Availability",
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
                    description="No availability set yet."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={() => setEditorOpen(true)}>
                      Set Availability
                    </Button>
                  </Empty>
                )}
              </div>
            ),
          },
          {
            key: "overrides",
            label: "Overrides",
            children: (
              <div style={{ padding: 24 }}>
                {loadingOverrides ? (
                  <Spin />
                ) : overrides.length > 0 ? (
                  <div>
                    <OverridesTable
                      overrides={overrides}
                      loading={loadingOverrides}
                      onDelete={handleDelete}
                    />
                  </div>
                ) : (
                  <Empty
                    description="No overrides created yet."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button
                      type="primary"
                      onClick={() => setOverrideOpen(true)}
                    >
                      Create Override
                    </Button>
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
            message.error("Failed to save schedule");
          }
        }}
      />

      <OverrideModal
        open={overrideOpen}
        onClose={() => setOverrideOpen(false)}
        onSave={async (data) => {
          try {
            await api.post("/schedules/schedule-overrides", data);
            message.success("Override created");
            setOverrideOpen(false);
            fetchOverrides();
          } catch {
            message.error("Failed to create override");
          }
        }}
      />
    </PageLayout>
  );
}
