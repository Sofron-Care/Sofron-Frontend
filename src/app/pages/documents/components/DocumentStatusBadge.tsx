import { Tag } from "antd";

export default function DocumentStatusBadge({
  isActive,
}: {
  isActive: boolean;
}) {
  return (
    <Tag color={isActive ? "green" : "red"}>
      {isActive ? "Active" : "Inactive"}
    </Tag>
  );
}
