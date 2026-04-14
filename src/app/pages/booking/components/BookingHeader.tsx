import { Button } from "antd";
import { HeartOutlined, HeartFilled, StarFilled } from "@ant-design/icons";

type Props = {
  organization: {
    name: string;
    logoUrl?: string;
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    rating: string;
    reviewCount: number;
  };

  isAuthenticated?: boolean;
  isFavorited?: boolean;
  favLoading?: boolean;

  onToggleFavorite?: () => void;
  onOpenReviews?: () => void;
};

export default function BookingHeader({ organization, isAuthenticated, isFavorited, favLoading, onToggleFavorite, onOpenReviews }: Props) {
  return (
    <div className="booking-org-header">
      <div className="booking-org-header__brand">
        {organization.logoUrl ? (
          <img
            src={organization.logoUrl}
            alt={organization.name}
            className="booking-org-header__logo"
          />
        ) : (
          <div className="booking-org-header__logo booking-org-header__logo--placeholder" />
        )}

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 className="booking-org-header__title">{organization.name}</h1>

            {organization.rating !== undefined && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
                onClick={onOpenReviews}
              >
                <StarFilled style={{ color: "var(--color-primary)" }} />
                <span>{organization.rating || 0}</span>
                <span style={{ opacity: 0.7 }}>
                  ({organization.reviewCount || 0})
                </span>
              </div>
            )}

            {isAuthenticated && (
              <Button
                type="text"
                loading={favLoading}
                icon={
                  isFavorited ? (
                    <HeartFilled style={{ color: "#ef4444" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={onToggleFavorite}
              />
            )}
          </div>

          <p className="booking-org-header__address">
            {organization.streetAddress} • {organization.city} •{" "}
            {organization.state} {organization.zipcode}
          </p>
        </div>
      </div>
    </div>
  );
}
