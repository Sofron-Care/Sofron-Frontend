import { useTranslation } from "react-i18next";

export default function SolutionSection() {
  const { t } = useTranslation();

  const solutions = t("entry.solution.items", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];

  return (
    <section className="section">
      <div className="container">
        <span className="section-label">{t("entry.solution.label")}</span>

        <h2>{t("entry.solution.title")}</h2>

        <div className="solution-grid">
          {solutions.map((item, i) => (
            <div key={i} className="solution-card">
              <div className="solution-title">{item.title}</div>
              <div className="solution-description">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
