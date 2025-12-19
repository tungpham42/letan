import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Empty } from "antd";
import {
  UserOutlined,
  ArrowUpOutlined,
  GiftOutlined,
  ShopOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Visitor } from "../types";

const KEY_VISITORS = "reception_visitors_data";
const KEY_DELIVERIES = "reception_deliveries_data";
const KEY_COMPANIES = "reception_companies_data";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    activeVisitors: 0,
    todayVisitors: 0,
    pendingDeliveries: 0,
    totalCompanies: 0,
  });

  useEffect(() => {
    try {
      const rawVisitors = localStorage.getItem(KEY_VISITORS);
      let active = 0,
        todayCount = 0;
      if (rawVisitors) {
        const visitors: Visitor[] = JSON.parse(rawVisitors);
        const todayStr = dayjs().format("DD/MM/YYYY");
        active = visitors.filter((v) => v.status === "active").length;
        todayCount = visitors.filter(
          (v) => v.checkInTime && v.checkInTime.includes(todayStr)
        ).length;
      }

      const rawDeliveries = localStorage.getItem(KEY_DELIVERIES);
      let pending = 0;
      if (rawDeliveries) {
        const deliveries: any[] = JSON.parse(rawDeliveries);
        pending = deliveries.filter((d: any) => d.status === "pending").length;
      }

      const rawCompanies = localStorage.getItem(KEY_COMPANIES);
      let totalComp = 0;
      if (rawCompanies) {
        totalComp = JSON.parse(rawCompanies).length;
      }

      setStats({
        activeVisitors: active,
        todayVisitors: todayCount,
        pendingDeliveries: pending,
        totalCompanies: totalComp,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Helper để tạo Card thống kê đẹp
  const StatCard = ({ title, value, icon, color, bg }: any) => (
    <Card
      bordered={false}
      className="stat-card"
      style={{ height: "100%", borderRadius: 16 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 14 }}>
            {title}
          </Typography.Text>
          <Typography.Title
            level={2}
            style={{ margin: "4px 0 0", fontWeight: 700, color: "#1f2937" }}
          >
            {value}
          </Typography.Title>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon, { style: { fontSize: 24, color: color } })}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
          Tổng quan
        </Typography.Title>
        <Typography.Text type="secondary">
          <ClockCircleOutlined /> Cập nhật hôm nay:{" "}
          {dayjs().format("DD/MM/YYYY")}
        </Typography.Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Khách đang ở lại"
            value={stats.activeVisitors}
            icon={<UserOutlined />}
            color="#10b981" // Emerald
            bg="#d1fae5"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Lượt khách trong ngày"
            value={stats.todayVisitors}
            icon={<ArrowUpOutlined />}
            color="#3b82f6" // Blue
            bg="#dbeafe"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Bưu phẩm chờ lấy"
            value={stats.pendingDeliveries}
            icon={<GiftOutlined />}
            color="#f59e0b" // Amber
            bg="#fef3c7"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Công ty hoạt động"
            value={stats.totalCompanies}
            icon={<ShopOutlined />}
            color="#8b5cf6" // Violet
            bg="#ede9fe"
          />
        </Col>
      </Row>

      {/* Khu vực Placeholder cho biểu đồ hoặc danh sách gần đây */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="Hoạt động gần đây"
            bordered={false}
            style={{ borderRadius: 16 }}
          >
            <Empty
              description="Chưa có dữ liệu biểu đồ"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
