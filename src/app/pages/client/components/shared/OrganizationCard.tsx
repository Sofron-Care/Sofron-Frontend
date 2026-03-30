import { Button } from "antd";
import { useTranslation } from "react-i18next";
import type { Organization } from "../../types/organization";

interface Props {
  org: Organization;
  onBook?: (org: Organization) => void;
  onRemove?: (org: Organization) => void;
}

export default function OrganizationCard({ org, onBook, onRemove }: Props) {
  const { t } = useTranslation();

  return (
    <div className="organization-card">
      <div className="organization-card__info">
        <div className="organization-card__title">{org.name}</div>
        <div className="organization-card__meta">
          {org.city}, {org.state}
        </div>
      </div>

      <div className="organization-card__actions">
        <Button onClick={() => onBook?.(org)}>
          {t("clientDashboard.actions.book")}
        </Button>

        {onRemove && (
          <Button danger onClick={() => onRemove?.(org)}>
            {t("clientDashboard.actions.removeFavorite")}
          </Button>
        )}
      </div>
    </div>
  );
}
