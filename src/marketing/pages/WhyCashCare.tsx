import MarketingLayout from "../components/MarketingLayout";
import { useTranslation } from "react-i18next";

export default function WhyCashCare() {
  const { t } = useTranslation();

  const traditionalPoints = t("whyCashCare.traditional.points", {
    returnObjects: true,
  }) as string[];

  const needsPoints = t("whyCashCare.needs.points", {
    returnObjects: true,
  }) as string[];

  return (
    <MarketingLayout>
      <section className="section-tight">
        <div className="container">
          <h1
            style={{
              fontSize: "var(--font-size-3xl)",
              maxWidth: "700px",
              lineHeight: 1.1,
            }}
          >
            {t("whyCashCare.hero.headline")}
          </h1>

          <p style={{ marginTop: "var(--space-3)", maxWidth: "600px" }}>
            {t("whyCashCare.hero.subtext")}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="section-label">{t("whyCashCare.whatIs.label")}</div>

          <p style={{ maxWidth: "700px" }}>{t("whyCashCare.whatIs.text")}</p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="section-tight section-no-top">
        <div className="container">
          <div className="comparison-grid">
            {/* Traditional */}
            <div className="comparison-card">
              <div className="comparison-title">
                {t("whyCashCare.traditional.label")}
              </div>

              <ul className="comparison-list">
                {traditionalPoints.map((point, index) => (
                  <li key={index}>
                    <span className="comparison-icon-negative">✕</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Needs */}
            <div className="comparison-card comparison-card-positive ">
              <div className="comparison-title">
                {t("whyCashCare.needs.label")}
              </div>

              <ul className="comparison-list">
                {needsPoints.map((point, index) => (
                  <li key={index}>
                    <span className="comparison-icon-positive">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
