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
          <h2>{t("entry.cta.title")}</h2>

          <p className="cta-subtext">{t("entry.cta.subtitle")}</p>

          <div className="cta-button-group">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/demo/search")}
            >
              {t("entry.cta.primary")}
            </Button>

            <Button
              className="cta-secondary-btn"
              size="large"
              onClick={() => navigate("/demo/register/clinic")}
            >
              {t("entry.cta.secondary")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
