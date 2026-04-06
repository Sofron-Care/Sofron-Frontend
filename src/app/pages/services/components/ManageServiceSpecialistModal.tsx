import { useEffect, useState } from "react";
import { Modal, Checkbox, Spin, message, Input } from "antd";
import { useTranslation } from "react-i18next";
import api from "../../../../shared/api/axios";

interface Props {
  open: boolean;
  onClose: () => void;
  serviceId: number | null;
}

interface Specialist {
  id: number;
  firstName: string;
  lastName: string;
  specialistProfile?: {
    publicFacing?: boolean;
  };
}

export default function ManageServiceSpecialistsModal({
  open,
  onClose,
  serviceId,
}: Props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [originalIds, setOriginalIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open && serviceId) {
      fetchData(serviceId);
    }
  }, [open, serviceId]);

  const fetchData = async (id: number) => {
    setLoading(true);
    try {
      const [allRes, mappedRes] = await Promise.all([
        api.get("/organizations/employees"),
        api.get(`/services/${id}/specialists`),
      ]);

      const employees = allRes.data.data.employees;
      console.log(`EMPLOYEES: ${JSON.stringify(employees)}`);
      const allSpecialists = employees
        .filter((e: any) => e.role === "specialist")
        .map((e: any) => ({
          id: Number(e.id),
          firstName: e.firstName,
          lastName: e.lastName,
        }));
      console.log(`mappedRes: ${JSON.stringify(mappedRes)}`);
      const mapped = mappedRes.data.data.specialists;
      console.log(`MAPPED: ${mapped}`);
      const mappedIds = mapped.map((s: any) => Number(s.id));

      setSpecialists(allSpecialists);
      setSelectedIds(mappedIds);
      setOriginalIds(mappedIds);
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const toAdd = selectedIds.filter((id) => !originalIds.includes(id));
      const toRemove = originalIds.filter((id) => !selectedIds.includes(id));

      await Promise.all([
        ...toAdd.map((id) =>
          api.post(`/services/${serviceId}/specialists/${id}`),
        ),
        ...toRemove.map((id) =>
          api.delete(`/services/${serviceId}/specialists/${id}`),
        ),
      ]);

      message.success(t("services.specialists.updated"));
      onClose();
    } catch {
      message.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const filtered = specialists.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(`FILTERED: ${filtered}`);

  return (
    <Modal
      title={t("services.specialists.title")}
      open={open}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={loading}
    >
      <p className="service-specialists__description">
        {t("services.specialists.description")}
      </p>

      <Input
        placeholder={t("common.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="service-specialists__search"
      />

      <Spin spinning={loading}>
        <Checkbox.Group
          value={selectedIds}
          onChange={(vals) => setSelectedIds(vals as number[])}
          className="service-specialists__list"
        >
          {filtered.map((s) => (
            <div key={s.id} className="service-specialists__item">
              <Checkbox value={s.id}>
                {s.firstName} {s.lastName}
              </Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      </Spin>
    </Modal>
  );
}
