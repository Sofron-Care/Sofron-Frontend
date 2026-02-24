import type { ReactNode } from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  children: ReactNode;
}

export default function PageLayout({
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  children,
}: PageLayoutProps) {
  return (
    <div>
      {/* Header Row */}
      <div className="page-header">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>

        {primaryAction && (
          <div className="page-primary-action">{primaryAction}</div>
        )}
      </div>

      {/* Secondary Row */}
      {secondaryActions && (
        <div className="page-secondary-actions">{secondaryActions}</div>
      )}

      {/* Content */}
      <div className="page-content">{children}</div>
    </div>
  );
}
