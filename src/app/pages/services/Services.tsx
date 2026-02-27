import { useEffect, useState } from "react";
import { Table, Button, Dropdown, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import api from "./../../../shared/api/axios";
import PageLayout from "./../../layout/PageLayout";
import type { Service } from "./services.types";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";
import CreateServiceModal from "./components/CreateServiceModal";

export default function Services() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setServices(res.data.data.services);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t("services.table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("services.table.category"),
      key: "category",
      render: (_: any, record: Service) =>
        record.category?.title || record.otherCategory || "-",
    },
    {
      title: t("services.table.price"),
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: t("services.table.duration"),
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} min`,
    },
    {
      title: t("services.table.featured"),
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (featured: boolean) =>
        featured ? <Tag color="green">{t("services.featured")}</Tag> : null,
    },
    {
      key: "actions",
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: t("common.edit") },
              { key: "delete", label: t("common.delete") },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <PageLayout
      title={t("services.title")}
      subtitle={t("services.subtitle")}
      primaryAction={
        user && can(user.role, "create:service") ? (
          <Button type="primary" onClick={() => setModalOpen(true)}>
            {t("services.create")}
          </Button>
        ) : null
      }
    >
      <div className="card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={services}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
        />
      </div>
      <CreateServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchServices}
      />
    </PageLayout>
  );
}
