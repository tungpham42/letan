import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Empty,
  Card,
  Typography,
  Row,
  Col,
  Grid,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  LoginOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Visitor } from "../types";

const STORAGE_KEY = "reception_visitors_data";
const { useBreakpoint } = Grid; // Hook để check size màn hình

const VisitorPage: React.FC = () => {
  const [data, setData] = useState<Visitor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint(); // Detect mobile

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (e) {}
    }
  }, []);

  const updateData = (newData: Visitor[]) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const handleCheckIn = (values: any) => {
    const newVisitor: Visitor = {
      id: Date.now().toString(),
      ...values,
      checkInTime: dayjs().format("HH:mm DD/MM/YYYY"),
      status: "active",
    };
    updateData([newVisitor, ...data]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Check-in thành công!");
  };

  const handleCheckOut = (id: string) => {
    const newData = data.map((item) =>
      item.id === id
        ? ({
            ...item,
            status: "completed",
            checkOutTime: dayjs().format("HH:mm DD/MM/YYYY"),
          } as Visitor)
        : item
    );
    updateData(newData);
    message.success("Check-out thành công!");
  };

  const handleDelete = (id: string) => {
    updateData(data.filter((item) => item.id !== id));
    message.success("Đã xóa bản ghi.");
  };

  const columns: ColumnsType<Visitor> = [
    {
      title: "HỌ TÊN",
      dataIndex: "name",
      key: "name",
      fixed: screens.xs ? "left" : undefined, // Cố định cột tên trên mobile
      width: 140, // Set width để scroll hoạt động tốt
      render: (text) => (
        <span style={{ fontWeight: 600, color: "#111827" }}>{text}</span>
      ),
    },
    {
      title: "ĐẾN TỪ",
      dataIndex: "company",
      key: "company",
      width: 120,
      render: (t) => <span style={{ color: "#6b7280" }}>{t}</span>,
    },
    { title: "GẶP AI", dataIndex: "host", key: "host", width: 120 },
    {
      title: "TẦNG",
      dataIndex: "floor",
      key: "floor",
      align: "center",
      width: 70,
      render: (t) => (
        <Tag
          color="default"
          style={{
            borderRadius: 10,
            border: "none",
            background: "#f3f4f6",
            fontWeight: 600,
          }}
        >
          {t}
        </Tag>
      ),
    },
    { title: "MỤC ĐÍCH", dataIndex: "purpose", key: "purpose", width: 100 },
    {
      title: "GIỜ VÀO",
      dataIndex: "checkInTime",
      key: "checkInTime",
      width: 130,
      render: (t) => (
        <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{t}</span>
      ),
    },
    {
      title: "TRẠNG THÁI",
      key: "status",
      align: "center",
      width: 100,
      render: (_, { status }) => (
        <Tag
          color={status === "active" ? "success" : "default"}
          style={{ borderRadius: 20, border: "none" }}
        >
          {status === "active" ? "Đang ở" : "Đã về"}
        </Tag>
      ),
    },
    {
      title: "THAO TÁC",
      key: "action",
      align: "center",
      width: 100,
      fixed: screens.xs ? "right" : undefined,
      render: (_, record) => (
        <Space>
          {record.status === "active" && (
            <Popconfirm
              title="Khách ra?"
              onConfirm={() => handleCheckOut(record.id)}
              okText="Có"
              cancelText="Hủy"
            >
              <Button type="primary" size="small" ghost>
                Ra
              </Button>
            </Popconfirm>
          )}
          {record.status === "completed" && (
            <Popconfirm
              title="Xóa?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          flexDirection: screens.xs ? "column" : "row", // Stack dọc trên mobile
          justifyContent: "space-between",
          alignItems: screens.xs ? "flex-start" : "center",
          gap: 12,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Khách ra vào
          </Typography.Title>
          {!screens.xs && (
            <Typography.Text type="secondary">
              Quản lý nhật ký check-in, check-out
            </Typography.Text>
          )}
        </div>
        <Button
          type="primary"
          size="large"
          icon={<LoginOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ width: screens.xs ? "100%" : "auto" }} // Full width button trên mobile
        >
          Đăng ký Khách
        </Button>
      </div>

      <Card
        bordered={false}
        style={{ borderRadius: 16 }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          // QUAN TRỌNG: Cho phép scroll ngang trên mobile
          scroll={{ x: 900 }}
          pagination={{ pageSize: 8, size: "small" }}
          locale={{
            emptyText: (
              <Empty
                description="Chưa có khách"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Đăng ký Khách mới
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Check-in"
        cancelText="Hủy"
        width={600}
        style={{ top: 20, maxWidth: "100vw", paddingBottom: 0 }} // Fix width modal
        centered={false}
        bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }} // Scroll nội dung modal nếu quá dài
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCheckIn}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="name"
            label="Họ tên khách"
            rules={[{ required: true, message: "Nhập tên!" }]}
          >
            <Input size="large" placeholder="VD: Nguyễn Văn A" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item name="company" label="Đến từ">
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="purpose" label="Mục đích" initialValue="Họp">
                <Select
                  size="large"
                  options={[
                    { value: "Họp", label: "Họp" },
                    { value: "Giao hàng", label: "Giao hàng" },
                    { value: "Phỏng vấn", label: "Phỏng vấn" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              background: "#f9fafb",
              padding: 16,
              borderRadius: 8,
              marginBottom: 24,
            }}
          >
            <Typography.Text
              strong
              style={{ display: "block", marginBottom: 12 }}
            >
              Thông tin người đón tiếp
            </Typography.Text>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="host"
                  label="Người cần gặp"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    size="large"
                    prefix={<SearchOutlined />}
                    placeholder="Tìm nhân viên..."
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="floor"
                  label="Tầng"
                  rules={[{ required: true }]}
                  style={{ marginBottom: 0 }}
                >
                  <Input size="large" style={{ textAlign: "center" }} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default VisitorPage;
