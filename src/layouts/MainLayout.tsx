import React, { useState, useEffect } from "react";
import { Layout, Menu, ConfigProvider, Typography, Drawer, Grid } from "antd";
import {
  DashboardOutlined,
  DropboxOutlined,
  TeamOutlined,
  BuildOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  // Tự động đóng Drawer khi chuyển trang trên mobile
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: "Tổng quan" },
    { key: "/quan-ly-khach", icon: <TeamOutlined />, label: "Khách ra vào" },
    { key: "/buu-pham", icon: <DropboxOutlined />, label: "Bưu phẩm" },
    {
      key: "/danh-ba-cong-ty",
      icon: <BuildOutlined />,
      label: "Danh bạ Công ty",
    },
  ];

  const LogoArea = () => (
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed && !screens.xs ? "center" : "flex-start",
        padding: collapsed && !screens.xs ? 0 : "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          background: "#4f46e5",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: collapsed && !screens.xs ? 0 : 12,
          flexShrink: 0,
        }}
      >
        <BuildOutlined style={{ color: "#fff", fontSize: 18 }} />
      </div>
      {(!collapsed || !screens.md) && (
        <Typography.Title
          level={4}
          className="logo-text"
          style={{ margin: 0, fontSize: 18, whiteSpace: "nowrap" }}
        >
          LỄ TÂN TÒA NHÀ
        </Typography.Title>
      )}
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Work Sans', sans-serif",
          colorPrimary: "#4f46e5",
          borderRadius: 12,
          colorBgContainer: "#ffffff",
          colorBgLayout: "#f3f4f6",
        },
        components: {
          Menu: {
            itemSelectedBg: "#e0e7ff",
            itemSelectedColor: "#4f46e5",
            itemBorderRadius: 8,
            itemMarginInline: 8,
          },
          Table: { headerBg: "#f9fafb", borderRadiusLG: 12 },
          Button: { fontWeight: 500, controlHeight: 40 },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* PC Sidebar: Chỉ hiện khi màn hình >= md */}
        {screens.md && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={260}
            style={{
              background: "#fff",
              borderRight: "1px solid #f0f0f0",
              position: "sticky",
              top: 0,
              height: "100vh",
              zIndex: 101,
              left: 0,
            }}
          >
            <LogoArea />
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={menuItems}
              style={{ borderRight: 0, paddingTop: 16 }}
            />
          </Sider>
        )}

        {/* Mobile Drawer: Thay thế Sidebar trên mobile */}
        {!screens.md && (
          <Drawer
            placement="left"
            onClose={() => setMobileMenuOpen(false)}
            open={mobileMenuOpen}
            width={280}
            styles={{ body: { padding: 0 } }}
            closable={false}
          >
            <LogoArea />
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => navigate(key)}
              items={menuItems}
              style={{ borderRight: 0, paddingTop: 16 }}
            />
          </Drawer>
        )}

        <Layout>
          <Header
            className="glass-header"
            style={{
              padding: screens.md ? "0 24px" : "0 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {/* Nút Trigger Menu */}
              {React.createElement(MenuOutlined, {
                className: "trigger",
                onClick: () =>
                  screens.md
                    ? setCollapsed(!collapsed)
                    : setMobileMenuOpen(true),
                style: { fontSize: 18, cursor: "pointer", color: "#6b7280" },
              })}
            </div>
          </Header>

          <Content
            style={{
              margin: screens.md ? "24px 24px" : "16px 12px",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;
