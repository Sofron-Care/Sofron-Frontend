import axios from "./../../../shared/api/axios";

export const getNotifications = () =>
  axios.get("/notifications");

export const markAllAsRead = () =>
  axios.patch("/notifications/read-all");

export const markSelectedAsRead = (ids: number[]) =>
  axios.patch("/notifications/selected", { ids });

export const markOneAsRead = (id: number) =>
  axios.patch(`/notifications/${id}`);

export const deleteNotification = (id: number) =>
  axios.delete(`/notifications/${id}`);

export const deleteAllNotifications = () =>
  axios.delete("/notifications");

export const deleteSelectedNotifications = (ids: number[]) =>
  axios.delete("/notifications/selected", { data: { ids } });