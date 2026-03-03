import { Modal, Button, TimePicker, Row, Col, message } from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  initialPattern: any[] | null;
  onSave: (weeklyPattern: any[]) => void;
}

export default function AvailabilityEditorModal({
  open,
  onClose,
  initialPattern,
  onSave,
}: Props) {
  const [weekly, setWeekly] = useState<any>({});
  const { t } = useTranslation();

  const days = [
    t("common.days.sunday"),
    t("common.days.monday"),
    t("common.days.tuesday"),
    t("common.days.wednesday"),
    t("common.days.thursday"),
    t("common.days.friday"),
    t("common.days.saturday"),
  ];

  useEffect(() => {
    const grouped: any = {};
    for (let i = 0; i < 7; i++) grouped[i] = [];

    if (initialPattern) {
      initialPattern.forEach((entry) => {
        grouped[entry.day].push({
          start: entry.start,
          end: entry.end,
        });
      });
    }

    setWeekly(grouped);
  }, [initialPattern, open]);

  const addBlock = (day: number) => {
    setWeekly((prev: any) => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00", end: "17:00" }],
    }));
  };

  const updateBlock = (
    day: number,
    index: number,
    field: "start" | "end",
    value: string,
  ) => {
    const updated = { ...weekly };
    updated[day][index][field] = value;
    setWeekly(updated);
  };

  const removeBlock = (day: number, index: number) => {
    const updated = { ...weekly };
    updated[day].splice(index, 1);
    setWeekly(updated);
  };

  const handleSave = () => {
    for (const day of Object.keys(weekly)) {
      for (const block of weekly[day]) {
        if (!block.start || !block.end) {
          message.error(t("schedule.availability.errors.missingTime"));
          return;
        }

        if (block.start >= block.end) {
          message.error(t("schedule.availability.errors.missingTime"));
          return;
        }
      }
    }

    for (const day of Object.keys(weekly)) {
      const blocks = weekly[day].sort((a: any, b: any) =>
        a.start.localeCompare(b.start),
      );

      for (let i = 0; i < blocks.length - 1; i++) {
        if (blocks[i].end > blocks[i + 1].start) {
          message.error(
            t("schedule.availability.errors.overlap", {
              day: days[Number(day)],
            }),
          );
          return;
        }
      }
    }

    const flat: any[] = [];

    Object.keys(weekly).forEach((day) => {
      weekly[day]
        .sort((a: any, b: any) => a.start.localeCompare(b.start))
        .forEach((block: any) => {
          flat.push({
            day: Number(day),
            start: block.start,
            end: block.end,
          });
        });
    });

    onSave(flat);
  };

  return (
    <Modal
      title={t("schedule.availability.modalTitle")}
      open={open}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t("common.cancel")}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {t("common.save")}
        </Button>,
      ]}
    >
      {days.map((label, dayIndex) => (
        <div key={dayIndex} style={{ marginBottom: 16 }}>
          <strong>{label}</strong>

          {weekly[dayIndex]?.map((block: any, index: number) => (
            <Row key={index} gutter={8} style={{ marginTop: 8 }}>
              <Col>
                <TimePicker
                  value={dayjs(block.start, "HH:mm")}
                  format="HH:mm"
                  onChange={(val) =>
                    updateBlock(
                      dayIndex,
                      index,
                      "start",
                      val?.format("HH:mm") || "",
                    )
                  }
                />
              </Col>

              <Col>
                <TimePicker
                  value={dayjs(block.end, "HH:mm")}
                  format="HH:mm"
                  onChange={(val) =>
                    updateBlock(
                      dayIndex,
                      index,
                      "end",
                      val?.format("HH:mm") || "",
                    )
                  }
                />
              </Col>

              <Col>
                <Button danger onClick={() => removeBlock(dayIndex, index)}>
                  {t("common.remove")}
                </Button>
              </Col>
            </Row>
          ))}

          <Button
            type="link"
            onClick={() => addBlock(dayIndex)}
            style={{ paddingLeft: 0 }}
          >
            {t("schedule.availability.addTimeBlock")}
          </Button>
        </div>
      ))}
    </Modal>
  );
}
