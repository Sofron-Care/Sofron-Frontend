import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { StarFilled } from "@ant-design/icons";

type Props = {
  org: {
    publicId: string;
    name: string;
    city: string;
    state: string;
    streetAddress: string;
    logoUrl?: string;
    averageRating?: string | number | null;
    reviewCount?: string | number | null;
  };
};

export default function OrganizationCard({ org }: Props) {
  const navigate = useNavigate();

  const avg = org.averageRating ? parseFloat(String(org.averageRating)) : null;

  const count = org.reviewCount ? parseInt(String(org.reviewCount)) : 0;

  return (
    <div className="result-card">
      {org.logoUrl && (
        <img src={org.logoUrl} alt={org.name} className="result-image" />
      )}

      <div className="result-content">
        <h3 style={{ marginBottom: 4 }}>{org.name}</h3>

        <div style={{ marginBottom: 6, color: "#888" }}>
          {avg ? (
            <span>
              <StarFilled style={{ color: "var(--color-primary)" }} />
              <span style={{ fontWeight: 500 }}>{avg.toFixed(1)} / 5</span>
              <span style={{ opacity: 0.7, marginLeft: 6 }}>({count} reviews)</span>
            </span>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>

        <p style={{ marginBottom: 8 }}>
          {org.streetAddress}, {org.city}, {org.state}
        </p>

        <div className="result-actions">
          <Button
            type="primary"
            onClick={() => navigate(`/demo/clinic/${org.publicId}`)}
          >
            View & Book
          </Button>
        </div>
      </div>
    </div>
  );
}
