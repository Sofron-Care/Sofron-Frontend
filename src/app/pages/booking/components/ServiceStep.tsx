import { Spin } from "antd";
import { useTranslation } from "react-i18next";

type Service = {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: number | string;
};

type Category = {
  id: number | null;
  title: string;
  services: Service[];
};

type Props = {
  loading: boolean;
  featuredServices: Service[];
  categories: Category[];
  selectedServiceId: number | null;
  onSelect: (service: Service) => void;
};

export default function ServiceStep({
  loading,
  featuredServices,
  categories,
  selectedServiceId,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="booking-panel booking-panel--loading">
        <Spin />
      </div>
    );
  }

  return (
    <div className="booking-panel">
      <h2 className="booking-panel__title">Select a service</h2>

      {featuredServices.length > 0 && (
        <div className="booking-service-section">
          <h3 className="booking-service-section__title">
            {t("booking.service.featured")}
          </h3>
          <div className="booking-service-list">
            {featuredServices.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`booking-service-card ${
                  selectedServiceId === service.id ? "is-selected" : ""
                }`}
                onClick={() => onSelect(service)}
              >
                <div>
                  <div className="booking-service-card__name">
                    {service.name}
                  </div>
                  {service.description && (
                    <div className="booking-service-card__description">
                      {service.description}
                    </div>
                  )}
                </div>

                <div className="booking-service-card__meta">
                  <span>
                    {t("booking.service.duration", {
                      duration: service.duration,
                    })}
                  </span>

                  <span>
                    {typeof service.price === "number"
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(service.price)
                      : service.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {categories.map((category) => (
        <div key={category.title} className="booking-service-section">
          <h3 className="booking-service-section__title">{category.title}</h3>

          <div className="booking-service-list">
            {category.services.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`booking-service-card ${
                  selectedServiceId === service.id ? "is-selected" : ""
                }`}
                onClick={() => onSelect(service)}
              >
                <div>
                  <div className="booking-service-card__name">
                    {service.name}
                  </div>
                  {service.description && (
                    <div className="booking-service-card__description">
                      {service.description}
                    </div>
                  )}
                </div>

                <div className="booking-service-card__meta">
                  <span>
                    {t("booking.service.duration", {
                      duration: service.duration,
                    })}
                  </span>

                  <span>
                    {typeof service.price === "number"
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(service.price)
                      : service.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
