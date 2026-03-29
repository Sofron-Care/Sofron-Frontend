import { useTranslation } from "react-i18next";

export default function ProblemSection() {
  const { t } = useTranslation();

  const items = t("entry.problem.items", { returnObjects: true }) as string[];

  return (
    <section className="section">
      <div className="container problem-grid">
        {/* LEFT */}
        <div>
          <span className="section-label">{t("entry.problem.label")}</span>

          <h2>{t("entry.problem.title")}</h2>

          <p style={{ marginTop: 12 }}>{t("entry.problem.subtitle")}</p>
        </div>

        {/* RIGHT */}
        <div className="problem-card">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {items.map((item, i) => (
              <div key={i} className="problem-item">
                <div className="problem-dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
