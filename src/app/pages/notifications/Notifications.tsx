import { Table, Button, Space, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as api from "./notifications.api";
import type { ColumnsType } from "antd/es/table";
import type { Key } from "react";
import PageLayout from "./../../layout/PageLayout";
import { formatNotificationDate } from "./../../utils/formatDate";
import { useNotifications } from "./../../../hooks/useNotifications";

type Notification = {
  id: number;
  notificationType: string;
  isRead: boolean;
  message: string;
  metadata?: Record<string, any>;
  sentAt?: string;
  createdAt: string;
};

export default function NotificationsPage() {
  const { t } = useTranslation();
  const { notifications, loading, fetchNotifications, markAsRead, remove } =
    useNotifications();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const hasSelection = selectedRowKeys.length > 0;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAll = async () => {
    await api.markAllAsRead();
    message.success(t("notifications.markAllRead"));
    fetchNotifications();
  };

  const handleClearAll = async () => {
    await api.deleteAllNotifications();
    message.success(t("notifications.clearAll"));
    fetchNotifications();
  };

  const handleMarkSelected = async () => {
    const ids = selectedRowKeys.map(Number);
    await api.markSelectedAsRead(ids);
    message.success(t("notifications.markSelectedRead"));
    setSelectedRowKeys([]);
    fetchNotifications();
  };

  const handleDeleteSelected = async () => {
    const ids = selectedRowKeys.map(Number);
    await api.deleteSelectedNotifications(ids);
    message.success(t("notifications.deleteSelected"));
    setSelectedRowKeys([]);
    fetchNotifications();
  };

  const handleMarkOne = (id: number) => {
    markAsRead(id);
  };

  const handleDeleteOne = (id: number) => {
    remove(id);
  };

  const columns: ColumnsType<Notification> = [
    {
      title: t("notifications.columns.status"),
      dataIndex: "isRead",
      render: (isRead: boolean) => (
        <Tag color={isRead ? "default" : "blue"}>
          {isRead
            ? t("notifications.status.read")
            : t("notifications.status.unread")}
        </Tag>
      ),
      width: 120,
    },
    {
      title: t("notifications.columns.message"),
      dataIndex: "message",
      render: (text: string, record) => (
        <div className={`notification-title ${!record.isRead ? "unread" : ""}`}>
          {text}
        </div>
      ),
    },
    {
      title: t("notifications.columns.date"),
      dataIndex: "createdAt",
      render: (value: string) => formatNotificationDate(value),
    },
    {
      title: t("notifications.columns.actions"),
      render: (_value, record) => (
        <Space>
          {!record.isRead && (
            <Button size="small" onClick={() => handleMarkOne(record.id)}>
              {t("notifications.actions.markRead")}
            </Button>
          )}
          <Button
            size="small"
            danger
            onClick={() => handleDeleteOne(record.id)}
          >
            {t("notifications.actions.delete")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageLayout
      title={t("notifications.title")}
      //   primaryAction={null}
      primaryAction={
        <>
          {hasSelection ? (
            <>
              <Button onClick={handleMarkSelected}>
                {t("notifications.markSelectedRead")}
              </Button>

              <Button danger onClick={handleDeleteSelected}>
                {t("notifications.deleteSelected")}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleMarkAll}>
                {t("notifications.markAllRead")}
              </Button>

              <Button danger onClick={handleClearAll}>
                {t("notifications.clearAll")}
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="card card-table">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={notifications}
          columns={columns}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          rowClassName={(record) =>
            record.isRead ? "notification-read" : "notification-unread"
          }
          scroll={{ x: 600 }}
        />
      </div>
    </PageLayout>
  );
}
