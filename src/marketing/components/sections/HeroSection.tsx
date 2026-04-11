import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container hero-grid">
        {/* LEFT COLUMN */}
        <div>
          <h1 className="hero-title">{t("landing.hero.title")}</h1>

          <p className="hero-subtitle">{t("landing.hero.subtitle")}</p>

          <p className="hero-pitch">{t("landing.hero.pitch")}</p>

          <div className="hero-cta-group">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/contact")}
            >
              {t("landing.hero.cta_primary")}
            </Button>

            <Button size="large" onClick={() => navigate("/demo")}>
              {t("landing.hero.cta_secondary")}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="card" style={{ minHeight: "320px" }}>
          {/* Placeholder for product mockup */}
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
            }}
          >
            Product Preview Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
