import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Empty,
  Card,
  Typography,
  Avatar,
  Grid,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  PhoneOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Company } from "../types";

const STORAGE_KEY = "reception_companies_data";
const { useBreakpoint } = Grid;

const CompaniesPage: React.FC = () => {
  const [data, setData] = useState<Company[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint(); // Hook kiểm tra kích thước màn hình

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (error) {}
    }
  }, []);

  const updateData = (newData: Company[]) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const handleAdd = (values: any) => {
    const newCo = { id: Date.now().toString(), ...values };
    updateData([newCo, ...data]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Đã thêm công ty mới");
  };

  const handleDelete = (id: string) => {
    updateData(data.filter((c) => c.id !== id));
    message.success("Đã xóa công ty");
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.floor.includes(searchText)
  );

  const columns: ColumnsType<Company> = [
    {
      title: "CÔNG TY",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: screens.xs ? "left" : undefined, // Cố định cột tên trên mobile
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            shape="square"
            size="large"
            style={{
              backgroundColor: "#e0e7ff",
              color: "#4f46e5",
              fontWeight: 700,
            }}
          >
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <span style={{ color: "#111827", fontSize: 16, fontWeight: 600 }}>
            {text}
          </span>
        </div>
      ),
    },
    {
      title: "VỊ TRÍ",
      key: "location",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Tag
            color="geekblue"
            style={{ width: "fit-content", borderRadius: 4, margin: 0 }}
          >
            Tầng {record.floor}
          </Tag>
          {record.room && (
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              P. {record.room}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "LIÊN HỆ",
      key: "contact",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.contactPerson}</div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            <PhoneOutlined /> {record.hotline}
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      align: "right",
      width: 60,
      fixed: screens.xs ? "right" : undefined,
      render: (_, record) => (
        <Popconfirm
          title="Xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            style={{ color: "#ef4444" }}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          flexDirection: screens.xs ? "column" : "row", // Mobile: Xếp dọc
          justifyContent: "space-between",
          alignItems: screens.xs ? "stretch" : "end", // Mobile: Full width
          gap: 16,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Danh bạ Công ty
          </Typography.Title>
          {!screens.xs && (
            <Typography.Text type="secondary">
              Tra cứu thông tin các đơn vị
            </Typography.Text>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: screens.xs ? "column" : "row",
          }}
        >
          <Input
            size="large"
            placeholder="Tìm tên, tầng..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: screens.xs ? "100%" : 250,
              borderRadius: 12,
            }}
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            style={{ boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.3)" }}
            block={!screens.md} // Mobile: Nút full width
          >
            Thêm mới
          </Button>
        </div>
      </div>

      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          // Cho phép cuộn ngang trên mobile (quan trọng)
          scroll={{ x: 600 }}
          locale={{
            emptyText: (
              <Empty
                description="Danh bạ trống"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 600 }}>Thêm Công ty</span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Thêm"
        cancelText="Hủy"
        centered={false}
        width={600}
        style={{ top: 20, maxWidth: "100vw", paddingBottom: 0 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Tên Công ty"
            rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
          >
            <Input
              size="large"
              prefix={<BankOutlined style={{ color: "#d1d5db" }} />}
              placeholder="Ví dụ: Công ty Công nghệ ABC"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                name="floor"
                label="Tầng"
                rules={[{ required: true, message: "Nhập tầng" }]}
              >
                <Input size="large" placeholder="VD: 12" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="room" label="Số phòng">
                <Input size="large" placeholder="VD: 1201" />
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              borderTop: "1px dashed #e5e7eb",
              margin: "8px 0 24px 0",
            }}
          ></div>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item name="contactPerson" label="Người đại diện">
                <Input size="large" placeholder="Tên Admin/HR" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="hotline" label="Số điện thoại / Hotline">
                <Input
                  size="large"
                  prefix={<PhoneOutlined style={{ color: "#d1d5db" }} />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default CompaniesPage;
