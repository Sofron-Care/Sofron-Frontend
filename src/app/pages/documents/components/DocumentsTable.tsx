import { Table, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import DocumentStatusBadge from "./DocumentStatusBadge";
import DocumentRow from "./DocumentRow";
import type { DocumentTemplate } from "../Documents";
import dayjs from "dayjs";

interface Props {
  data: DocumentTemplate[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (template: DocumentTemplate) => void;
}

export default function DocumentsTable({
  data,
  loading,
  onRefresh,
  onEdit,
}: Props) {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("documents.table.title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("documents.table.status"),
      dataIndex: "isActive",
      key: "status",
      render: (isActive: boolean) => (
        <DocumentStatusBadge isActive={isActive} />
      ),
    },
    {
      title: t("documents.table.services"),
      key: "services",
      render: (_: any, record: any) => {
        const services =
          record.serviceMappings?.map((m: any) => m.service?.name) || [];

        const text = services.join(", ");

        return text ? (
          <Tooltip title={text}>
            <div className="table-cell-truncate">{text}</div>
          </Tooltip>
        ) : (
          t("documents.table.noServices")
        );
      },
    },
    {
      title: t("documents.table.updated"),
      key: "updated",
      render: (_: any, record: any) =>
        record.updatedAt ? dayjs(record.updatedAt).format("MMM D, YYYY") : "—",
    },
    {
      title: t("documents.table.actions"),
      key: "actions",
      render: (_: unknown, record: DocumentTemplate) => (
        <DocumentRow record={record} onRefresh={onRefresh} onEdit={onEdit} />
      ),
    },
  ];

  return (
    <Table rowKey="id" dataSource={data} columns={columns} loading={loading} scroll={{x: 600}}/>
  );
}
