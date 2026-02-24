import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function DemoNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #f0f0f0",
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
          <img src="/images/brand/logo-teal.svg" alt="Sofron" height="32" />
        </Link>

        {/* Desktop Nav */}
        <nav
          className="nav-desktop"
          style={{ display: "flex", gap: 16, alignItems: "center" }}
        >
          <Button type="text" onClick={() => navigate("/demo/login")}>
            Login
          </Button>

          <Button
            type="primary"
            onClick={() => navigate("/demo/register/client")}
          >
            Sign Up
          </Button>

          <Button
            type="link"
            onClick={() => navigate("/demo/register/clinic")}
            style={{ padding: 0 }}
          >
            For Clinics
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
          size={280}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Button
              type="text"
              onClick={() => {
                setOpen(false);
                navigate("/demo/login");
              }}
            >
              Login
            </Button>

            <Button
              type="primary"
              onClick={() => {
                setOpen(false);
                navigate("/demo/register/client");
              }}
            >
              Sign Up
            </Button>

            <Button
              type="link"
              onClick={() => {
                setOpen(false);
                navigate("/demo/register/clinic");
              }}
            >
              For Clinics
            </Button>
          </div>
        </Drawer>
      </div>
    </header>
  );
}
