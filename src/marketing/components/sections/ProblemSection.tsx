import { useTranslation } from "react-i18next";

export default function ProblemSection() {
  const { t } = useTranslation();
  const items = t("landing.problem.items", { returnObjects: true }) as string[];

  return (
    <section
      className="section"
      style={{ background: "var(--color-background)" }}
    >
      <div className="container problem-grid">
        {/* Left Column */}
        <div>
          <div className="section-label">{t("landing.problem.label")}</div>

          <h2
            style={{
              fontSize: "var(--font-size-2xl)",
              lineHeight: 1.2,
              maxWidth: "520px",
            }}
          >
            {t("landing.problem.headline")}
          </h2>

          <p style={{ marginTop: "var(--space-4)", maxWidth: "480px" }}>
            {t("landing.problem.intro")}
          </p>
        </div>

        {/* Right Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {items.map((item, index) => (
            <div key={index} className="problem-card">
              <div className="problem-item">
                <span className="problem-dot" />
                <div>{item}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
