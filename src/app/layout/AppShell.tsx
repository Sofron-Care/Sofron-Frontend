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


  if (!user) {
    return <Navigate to="/demo/login" replace />;
  }

  console.log(user)

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
