import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <img src="/images/brand/logo-teal.svg" alt="Sofron" height={28} />
            <p>{t("footer.tagline")}</p>
          </div>

          {/* Links */}
          <div className="footer-columns">
            {/* Product */}
            <div className="footer-column">
              <div className="footer-title">{t("footer.product")}</div>

              <Link className="nav-link" to="/product">
                {t("footer.overview")}
              </Link>
            </div>

            {/* Company */}
            <div className="footer-column">
              <div className="footer-title">{t("footer.company")}</div>

              <Link className="nav-link" to="/contact">
                {t("footer.contact")}
              </Link>
              <Link className="nav-link" to="/terms">
                {t("footer.terms")}
              </Link>
              <Link className="nav-link" to="/privacy">
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} Sofron. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
