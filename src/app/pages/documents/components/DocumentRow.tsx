import { Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import axios from "./../../../../shared/api/axios";
import type { DocumentTemplate } from "../Documents";
import { useTranslation } from "react-i18next";

interface Props {
  record: DocumentTemplate;
  onRefresh: () => void;
  onEdit: (template: DocumentTemplate) => void;
}

export default function DocumentRow({ record, onRefresh, onEdit }: Props) {
  const { t } = useTranslation();

  const toggleVisibility = async () => {
    try {
      await axios.patch(`/documents/templates/visibility/${record.id}`, {
        isActive: !record.isActive,
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const items = [
    {
      key: "toggle",
      label: record.isActive
        ? t("documents.actions.deactivate")
        : t("documents.actions.activate"),
      onClick: toggleVisibility,
    },
    {
      key: "edit",
      label: t("documents.actions.edit"),
      disabled: !record.isActive,
      onClick: () => onEdit(record),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <MoreOutlined style={{ cursor: "pointer" }} />
    </Dropdown>
  );
}
