import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = t("landing.howItWorks.steps", {
    returnObjects: true,
  }) as { title: string; description: string }[];

  return (
    <section className="section">
      <div className="container">
        <div className="section-label">{t("landing.howItWorks.label")}</div>

        <h2
          style={{
            fontSize: "var(--font-size-2xl)",
            lineHeight: 1.2,
            maxWidth: "600px",
          }}
        >
          {t("landing.howItWorks.headline")}
        </h2>

        <p
          style={{
            marginTop: "var(--space-4)",
            maxWidth: "540px",
          }}
        >
          {t("landing.howItWorks.intro")}
        </p>

        <div className="how-grid">
          {steps.map((step, index) => (
            <div key={index} className="how-step">
              <div className="how-number">{index + 1}</div>

              <div className="how-title">{step.title}</div>

              <div className="how-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
