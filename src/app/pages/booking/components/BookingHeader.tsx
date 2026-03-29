type Props = {
  organization: {
    name: string;
    logoUrl?: string;
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
  };
};

export default function BookingHeader({ organization }: Props) {
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
          <h1 className="booking-org-header__title">{organization.name}</h1>
          <p className="booking-org-header__address">
            {organization.streetAddress} • {organization.city} •{" "}
            {organization.state} {organization.zipcode}
          </p>
        </div>
      </div>
    </div>
  );
}
