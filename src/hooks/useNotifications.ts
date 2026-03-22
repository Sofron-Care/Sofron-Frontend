import { useEffect, useState, useCallback } from "react";
import * as api from "./../app/pages/notifications/notifications.api";

export type Notification = {
  id: number;
  notificationType: string;
  isRead: boolean;
  message: string;
  metadata?: Record<string, any>;
  sentAt?: string;
  createdAt: string;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const res = await api.getNotifications();
    setNotifications(res.data.data.notifications || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    await api.markOneAsRead(id);
  };

  const markAll = async () => {
    await api.markAllAsRead();
    fetchNotifications();
  };

  const remove = async (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await api.deleteNotification(id);
  };

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAll,
    remove,
  };
}
