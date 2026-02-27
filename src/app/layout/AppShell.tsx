import { Layout } from "antd";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";
import SidebarNav from "./SidebarNav";
import TopNav from "./TopNav";

const { Sider, Header, Content } = Layout;

export default function AppShell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      user?.requiresOnboarding &&
      !user.onboardingCompleted &&
      location.pathname !== "/demo/app/onboarding"
    ) {
      navigate("/demo/app/onboarding", { replace: true });
    }
  }, [user, location]);

  if (!user) {
    return <Navigate to="/demo/login" replace />;
  }

  return (
    <Layout className="app-layout">
      <Sider width={240} className="app-sider">
        <SidebarNav />
      </Sider>

      <Layout>
        <Header className="app-header">
          <TopNav />
        </Header>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
