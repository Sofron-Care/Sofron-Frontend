import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer, Dropdown } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { useTranslation } from "react-i18next";

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const staffRoles = [
    "clinicAdmin",
    "specialist",
    "freelanceAdmin",
    "frontDesk",
  ];

  const isLoggedIn = !!user;
  const isStaff = user && staffRoles.includes(user.role);

  /* =========================
     ACTIONS
  ========================= */
  const handleLogout = async () => {
    await logout();
    navigate("/demo");
  };

  const dashboardMenuItems = [
    {
      key: "client",
      label: t("nav.clientDashboard"),
      onClick: () => navigate("/demo/client"),
    },
  ];

  if (isStaff) {
    dashboardMenuItems.push({
      key: "staff",
      label: t("nav.clinicDashboard"),
      onClick: () => navigate("/demo/app"),
    });
  }

  /* =========================
     RENDER BUTTONS
  ========================= */
  const renderDesktopNav = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Button type="text" onClick={() => navigate("/demo/login")}>
            {t("nav.login")}
          </Button>

          <Button
            type="primary"
            onClick={() => navigate("/demo/register/client")}
          >
            {t("nav.signup")}
          </Button>

          <Button
            type="link"
            onClick={() => navigate("/demo/register/clinic")}
            className="nav__link-button"
          >
            {t("nav.forClinics")}
          </Button>
        </>
      );
    }

    return (
      <>
        <Dropdown menu={{ items: dashboardMenuItems }}>
          <Button type="text">{t("nav.dashboard")}</Button>
        </Dropdown>

        <Button type="text" onClick={handleLogout}>
          {t("nav.logout")}
        </Button>
      </>
    );
  };

  const renderMobileNav = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Button
            type="text"
            onClick={() => {
              setOpen(false);
              navigate("/demo/login");
            }}
          >
            {t("nav.login")}
          </Button>

          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
              navigate("/demo/register/client");
            }}
          >
            {t("nav.signup")}
          </Button>

          <Button
            type="link"
            onClick={() => {
              setOpen(false);
              navigate("/demo/register/clinic");
            }}
          >
            {t("nav.forClinics")}
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          type="text"
          onClick={() => {
            setOpen(false);
            navigate("/demo/client");
          }}
        >
          {t("nav.clientDashboard")}
        </Button>

        {isStaff && (
          <Button
            type="text"
            onClick={() => {
              setOpen(false);
              navigate("/demo/app");
            }}
          >
            {t("nav.clinicDashboard")}
          </Button>
        )}

        <Button
          type="text"
          onClick={async () => {
            setOpen(false);
            await handleLogout();
          }}
        >
          {t("nav.logout")}
        </Button>
      </>
    );
  };

  return (
    <header className="nav">
      <div className="nav__container container">
        {/* Logo */}
        <Link to="/demo" className="nav__logo">
          <img src="/images/brand/logo-teal.svg" alt="Sofron" />
        </Link>

        {/* Desktop */}
        <nav className="nav__desktop">{renderDesktopNav()}</nav>

        {/* Mobile Trigger */}
        <div className="nav__mobile-trigger">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Drawer */}
        <Drawer
          placement="right"
          onClose={() => setOpen(false)}
          open={open}
          className="nav__drawer"
        >
          <div className="nav__drawer-content">{renderMobileNav()}</div>
        </Drawer>
      </div>
    </header>
  );
}
