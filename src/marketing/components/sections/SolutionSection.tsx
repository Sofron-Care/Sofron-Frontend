import { useTranslation } from "react-i18next";

export default function SolutionSection() {
  const { t } = useTranslation();

  const features = t("landing.solution.features", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section className="section">
      <div className="container">
        <div className="section-label">{t("landing.solution.label")}</div>

        <h2
          style={{
            fontSize: "var(--font-size-2xl)",
            lineHeight: 1.2,
            maxWidth: "600px",
          }}
        >
          {t("landing.solution.headline")}
        </h2>

        <p
          style={{
            marginTop: "var(--space-4)",
            maxWidth: "540px",
          }}
        >
          {t("landing.solution.intro")}
        </p>

        <div className="solution-grid">
          {features.map((feature, index) => (
            <div key={index} className="solution-card">
              <div className="solution-title">{feature.title}</div>

              <div className="solution-description">{feature.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
