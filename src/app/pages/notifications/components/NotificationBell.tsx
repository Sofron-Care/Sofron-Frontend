import { Badge, Dropdown, List, Button, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./../../../../hooks/useNotifications";
import { useTranslation } from "react-i18next";
import { formatNotificationDate } from "../../../utils/formatDate";

export default function NotificationBell() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead } = useNotifications();

  const latest = notifications.slice(0, 5);

  const overlay = (
    <div className="notification-dropdown">
      {latest.length === 0 ? (
        <Empty description={t("notifications.empty")} />
      ) : (
        <List
          dataSource={latest}
          renderItem={(item) => (
            <List.Item
              className={`notification-item ${!item.isRead ? "unread" : ""}`}
              onClick={() => {
                markAsRead(item.id);
                navigate("/demo/app/notifications");
              }}
            >
              <div className="notification-title">{item.message}</div>
              <div className="notification-time">
                {formatNotificationDate(item.createdAt)}
              </div>
            </List.Item>
          )}
        />
      )}

      <div className="notification-footer">
        <Button type="link" onClick={() => navigate("/demo/app/notifications")}>
          {t("notifications.actions.viewAll")}
        </Button>
      </div>
    </div>
  );

  return (
    <Dropdown trigger={["click"]} popupRender={() => overlay}>
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
      </Badge>
    </Dropdown>
  );
}
