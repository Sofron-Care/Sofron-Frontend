import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function MarketingNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-divider)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "72px",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/brand/logo-teal.svg"
            alt="Sofron"
            height="32"
            className="logo-desktop"
          />
          <img
            src="/images/brand/icon-teal.svg"
            alt="Sofron"
            height="28"
            className="logo-mobile"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          <Link className="nav-link" to="/why-cash-care">
            {t("nav.why")}
          </Link>

          <Link className="nav-link" to="/product">
            {t("nav.product")}
          </Link>

          <Link className="nav-link" to="/demo">
            {t("nav.demo")}
          </Link>

          <Button type="primary" onClick={() => navigate("/contact")}>
            {t("nav.cta")}
          </Button>
        </nav>

        {/* Mobile Burger */}
        <div className="nav-mobile-trigger">
          <Button
            type="text"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Mobile Drawer */}
        <Drawer
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          width={280}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Link
              to="/why-cash-care"
              className="nav-link drawer-link"
              onClick={() => setOpen(false)}
            >
              {t("nav.why")}
            </Link>

            <Link
              to="/product"
              className="nav-link drawer-link"
              onClick={() => setOpen(false)}
            >
              {t("nav.product")}
            </Link>

            <Link
              to="/demo"
              className="nav-link drawer-link"
              onClick={() => setOpen(false)}
            >
              {t("nav.demo")}
            </Link>

            <Button
              type="primary"
              onClick={() => {
                setOpen(false);
                navigate("/contact");
              }}
            >
              {t("nav.cta")}
            </Button>
          </div>
        </Drawer>
      </div>
    </header>
  );
}
