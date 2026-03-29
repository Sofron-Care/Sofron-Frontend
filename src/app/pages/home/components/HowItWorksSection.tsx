import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const steps = t("entry.how.items", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <section className="section">
      <div className="container">
        <span className="section-label">{t("entry.how.label")}</span>

        <h2>{t("entry.how.title")}</h2>

        <div className="how-grid">
          {steps.map((step, i) => (
            <div key={i} className="how-step">
              <div className="how-number">{i + 1}</div>
              <div className="how-title">{step.title}</div>
              <div className="how-description">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
