import { Layout } from "antd";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import SidebarNav from "./SidebarNav";
import TopNav from "./TopNav";

const { Sider, Header, Content } = Layout;

export default function AppShell() {
  const { user } = useAuth();

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
