import { Button } from "antd";
import { useNavigate } from "react-router-dom";

type Props = {
  org: {
    publicId: string;
    name: string;
    city: string;
    state: string;
    streetAddress: string;
    logoUrl?: string;
  };
};

export default function OrganizationCard({ org }: Props) {
  const navigate = useNavigate();

  return (
    <div className="result-card">
      {org.logoUrl && (
        <img src={org.logoUrl} alt={org.name} className="result-image" />
      )}

      <div className="result-content">
        <h3 style={{ marginBottom: 4 }}>{org.name}</h3>

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
