import { Layout, Drawer, Grid } from "antd";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import SidebarNav from "./SidebarNav";
import TopNav from "./TopNav";

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

export default function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.md;

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) {
    return <Navigate to="/demo/login" replace />;
  }

  if (user.organizationId && user.orgAccessActive === false) {
    return <Navigate to="/demo/org-deactivated" replace />;
  }

  if (user.role === "client" && location.pathname.startsWith("/demo/app")) {
    return <Navigate to="/demo/client" replace />;
  }

  useEffect(() => {
    if (
      user.requiresOnboarding &&
      !user.onboardingCompleted &&
      location.pathname !== "/demo/app/onboarding"
    ) {
      navigate("/demo/app/onboarding", { replace: true });
    }
  }, [user, location]);

  return (
    <Layout className="app-layout">
      {/* ✅ Desktop Sidebar */}
      {!isMobile && (
        <Sider width={240} className="app-sider">
          <SidebarNav />
        </Sider>
      )}

      {/* ✅ Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          bodyStyle={{ padding: 0 }}
        >
          <SidebarNav onNavigate={() => setDrawerOpen(false)} />
        </Drawer>
      )}

      <Layout>
        <Header className="app-header">
          <TopNav onMenuClick={() => setDrawerOpen(true)} isMobile={isMobile} />
        </Header>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
