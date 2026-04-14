import MarketingLayout from "../components/MarketingLayout";
import { useTranslation } from "react-i18next";

export default function Product() {
  const { t } = useTranslation();

  const features = t("product.features", {
    returnObjects: true,
  }) as {
    key: string;
    title: string;
    description: string;
    image: string;
  }[];

  console.log(features);

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="section">
        <div className="container hero-grid">
          <div>
            <h1
              style={{
                fontSize: "var(--font-size-3xl)",
                lineHeight: 1.05,
                maxWidth: "650px",
              }}
            >
              {t("product.hero.headline")}
            </h1>

            <p
              style={{
                marginTop: "var(--space-4)",
                maxWidth: "560px",
              }}
            >
              {t("product.hero.subtext")}
            </p>
          </div>

          <div className="card product-preview-card">
            <img
              src="/images/previews/product_preview.png"
              alt="Sofron dashboard preview"
              className="product-preview-image"
            />
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <section key={index} className="section-tight">
          <div className="container">
            <div
              className={`feature-row ${
                index % 2 === 1 ? "feature-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className="feature-text">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
              </div>

              {/* Placeholder Visual */}
              <div className="feature-visual card product-preview-card">
                <img
                  src={feature.image}
                  alt={`${feature.title} preview`}
                  className="product-preview-image"
                />
              </div>
            </div>
          </div>
        </section>
      ))}
    </MarketingLayout>
  );
}
