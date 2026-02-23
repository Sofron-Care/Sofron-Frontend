import MarketingLayout from "../components/MarketingLayout";
import { useTranslation } from "react-i18next";

export default function Product() {
  const { t } = useTranslation();

  const features = t("product.features", {
    returnObjects: true,
  }) as { title: string; description: string }[];

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

          <div className="card" style={{ minHeight: "320px" }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
              }}
            >
              Product Overview Placeholder
            </div>
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
              <div className="feature-visual card">
                <div className="placeholder-content">
                  {feature.title} Preview Placeholder
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </MarketingLayout>
  );
}
