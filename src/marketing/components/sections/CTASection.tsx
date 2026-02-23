import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-container">
          <h2>{t("landing.cta.headline")}</h2>

          <p className="cta-subtext">{t("landing.cta.subtext")}</p>

          <div className="cta-button-group">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/contact")}
            >
              {t("landing.cta.primary")}
            </Button>

            <Button
              size="large"
              className="cta-secondary-btn"
              onClick={() => navigate("/demo")}
            >
              {t("landing.cta.secondary")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
