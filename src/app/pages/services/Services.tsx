import { useEffect, useState } from "react";
import { Table, Button, Dropdown, message, Modal } from "antd";
import { MoreOutlined, StarFilled } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import api from "./../../../shared/api/axios";
import PageLayout from "./../../layout/PageLayout";
import type { Service } from "./services.types";
import { useAuth } from "../../auth/AuthContext";
import { can } from "../../utils/permissions";
import ServiceModal from "./components/ServiceModal";
import type { ColumnsType } from "antd/es/table";

export default function Services() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

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

  const handleFeatureToggle = async (service: Service) => {
    try {
      await api.patch(`/services/${service.id}/feature`, {
        isFeatured: !service.isFeatured,
      });

      message.success(t("services.featureSuccess"));
      fetchServices();
    } catch {
      message.error(t("common.error") || "Error");
    }
  };

  const handleDelete = async (service: Service) => {
    Modal.confirm({
      title: "Delete Service",
      content: `Are you sure you want to delete "${service.name}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await api.delete(`/services/${service.id}`);
          message.success("Service deleted");
          fetchServices();
        } catch {
          message.error("Failed to delete service");
        }
      },
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const columns: ColumnsType<Service> = [
    {
      title: t("services.table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("services.table.category"),
      key: "category",
      render: (_: any, record) =>
        record.category?.title || record.otherCategory || "-",
    },
    {
      title: t("services.table.price"),
      dataIndex: "price",
      key: "price",
      render: (price) => {
        const numericPrice = Number(price);
        return `$${numericPrice.toFixed(2)}`;
      },
    },
    {
      title: t("services.table.duration"),
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} min`,
    },
    {
      title: t("services.table.featured"),
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (featured) =>
        featured ? <StarFilled style={{ color: "#fadb14" }} /> : null,
    },
  ];

  if (user && can(user.role, "edit:service")) {
    columns.push({
      key: "actions",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: t("common.edit"),
                onClick: () => handleEdit(record),
              },
              {
                key: "feature",
                label: record.isFeatured
                  ? t("services.unfeature")
                  : t("services.feature"),
                onClick: () => handleFeatureToggle(record),
              },
              {
                key: "delete",
                label: t("common.delete"),
                danger: true,
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    });
  }

  return (
    <PageLayout
      title={t("services.title")}
      subtitle={t("services.subtitle")}
      primaryAction={
        user && can(user.role, "create:service") ? (
          <Button
            type="primary"
            onClick={() => {
              setEditingService(null);
              setModalOpen(true);
            }}
          >
            {t("services.create")}
          </Button>
        ) : null
      }
    >
      <div className="card card-table">
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

      <ServiceModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingService(null);
        }}
        onSuccess={fetchServices}
        service={editingService}
      />
    </PageLayout>
  );
}
