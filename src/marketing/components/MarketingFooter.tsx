import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MarketingFooter() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-divider)",
        marginTop: "var(--space-9)",
        paddingTop: "var(--space-8)",
        paddingBottom: "var(--space-8)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Sofron
            </div>

            <p style={{ maxWidth: "320px" }}>{t("footer.tagline")}</p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "48px" }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "12px" }}>
                {t("footer.product")}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <Link className="nav-link" to="/product">
                  {t("footer.overview")}
                </Link>
                <Link className="nav-link" to="/demo">
                  {t("footer.demo")}
                </Link>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: "12px" }}>
                {t("footer.company")}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
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
        </div>

        <div
          style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid var(--color-divider)",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
          }}
        >
          © {new Date().getFullYear()} Sofron. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
