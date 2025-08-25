import React from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  SolutionOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const { Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "Home" },
  { type: "divider" as const },
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  {
    key: "/admin/bookings",
    icon: <FileTextOutlined />,
    label: "Bookings",
  },
  { key: "/admin/doctors", icon: <TeamOutlined />, label: "Doctors" },
  {
    key: "/admin/patients",
    icon: <UserOutlined />,
    label: "Patients",
  },

  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: "Settings",
    disabled: true,
  },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={styles.layoutRoot}>
      <Sider width={240} className={styles.sider}>
        <div className={styles.brand}>
          <SolutionOutlined style={{ fontSize: 32, color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            Admin
          </Title>
        </div>
        <Menu
          theme="light"
          selectedKeys={[
            location.pathname.startsWith("/admin")
              ? location.pathname
              : "/admin/dashboard",
          ]}
          onClick={({ key }) => navigate(String(key))}
          mode="inline"
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout className={styles.content}>
        <Content style={{ margin: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
