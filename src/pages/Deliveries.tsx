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
  Tooltip,
  Grid,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PlusOutlined,
  CheckOutlined,
  DeleteOutlined,
  FileTextOutlined,
  CodeSandboxOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DeliveryItem } from "../types";

const STORAGE_KEY = "reception_deliveries_data";
const { useBreakpoint } = Grid;

const DeliveriesPage: React.FC = () => {
  const [data, setData] = useState<DeliveryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  const updateData = (newData: DeliveryItem[]) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  const handleAdd = (values: any) => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      ...values,
      arrivalTime: dayjs().format("HH:mm DD/MM/YYYY"),
      status: "pending",
    };
    updateData([newItem, ...data]);
    setIsModalOpen(false);
    form.resetFields();
    message.success("Đã ghi nhận bưu phẩm mới");
  };

  const handlePickup = (id: string) => {
    const newData = data.map((item) =>
      item.id === id
        ? ({
            ...item,
            status: "picked_up",
            pickupTime: dayjs().format("HH:mm DD/MM/YYYY"),
          } as DeliveryItem)
        : item
    );
    updateData(newData);
    message.success("Đã xác nhận lấy hàng");
  };

  const handleDelete = (id: string) => {
    updateData(data.filter((item) => item.id !== id));
    message.success("Đã xóa");
  };

  const getTypeConfig = (type: string) => {
    switch (type) {
      case "document":
        return {
          icon: <FileTextOutlined />,
          color: "blue",
          text: "Tài liệu",
          bg: "#e6f4ff",
        };
      case "food":
        return {
          icon: <CoffeeOutlined />,
          color: "magenta",
          text: "Đồ ăn",
          bg: "#fff0f6",
        };
      default:
        return {
          icon: <CodeSandboxOutlined />,
          color: "orange",
          text: "Hàng hóa",
          bg: "#fff7e6",
        };
    }
  };

  const columns: ColumnsType<DeliveryItem> = [
    {
      title: "LOẠI HÀNG",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (type) => {
        const config = getTypeConfig(type);
        return (
          <Space
            style={{
              color: config.color,
              background: config.bg,
              padding: "4px 12px",
              borderRadius: 20,
              fontWeight: 500,
            }}
          >
            {config.icon} <span>{config.text}</span>
          </Space>
        );
      },
    },
    {
      title: "NGƯỜI NHẬN",
      dataIndex: "recipient",
      key: "recipient",
      fixed: screens.xs ? "left" : undefined,
      width: 150,
      render: (text) => (
        <span style={{ fontWeight: 600, fontSize: 15 }}>{text}</span>
      ),
    },
    {
      title: "CÔNG TY",
      dataIndex: "company",
      key: "company",
      width: 150,
      render: (t) => <span style={{ color: "#6b7280" }}>{t}</span>,
    },
    {
      title: "NGƯỜI GỬI",
      dataIndex: "sender",
      key: "sender",
      width: 150,
    },
    {
      title: "GIỜ ĐẾN",
      dataIndex: "arrivalTime",
      key: "arrivalTime",
      width: 140,
      render: (t) => (
        <span style={{ fontFamily: "monospace", color: "#6b7280" }}>{t}</span>
      ),
    },
    {
      title: "TRẠNG THÁI",
      key: "status",
      align: "center",
      width: 100,
      render: (_, record) => (
        <Tag
          color={record.status === "pending" ? "warning" : "success"}
          style={{
            borderRadius: 20,
            border: "none",
            fontWeight: 700,
          }}
        >
          {record.status === "pending" ? "Chờ lấy" : "Đã nhận"}
        </Tag>
      ),
    },
    {
      title: "THAO TÁC",
      key: "action",
      align: "center",
      width: 120,
      fixed: screens.xs ? "right" : undefined,
      render: (_, record) => (
        <Space>
          {record.status === "pending" ? (
            <Tooltip title="Đã nhận?">
              <Button
                type="primary"
                size="small"
                ghost
                icon={<CheckOutlined />}
                onClick={() => handlePickup(record.id)}
              >
                Nhận
              </Button>
            </Tooltip>
          ) : (
            <span
              style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}
            >
              {record.pickupTime?.split(" ")[0]}
            </span>
          )}
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
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
          flexDirection: screens.xs ? "column" : "row",
          justifyContent: "space-between",
          alignItems: screens.xs ? "stretch" : "center",
          gap: 16,
        }}
      >
        <div>
          <Typography.Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Bưu phẩm
          </Typography.Title>
          {!screens.xs && (
            <Typography.Text type="secondary">
              Quản lý thư từ, hàng hóa
            </Typography.Text>
          )}
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          block={screens.xs} // Full width button on mobile
          style={{ boxShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.3)" }}
        >
          Nhận Bưu phẩm
        </Button>
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
          dataSource={data}
          rowKey="id"
          // Cho phép cuộn ngang (rất quan trọng cho mobile)
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                description="Không có bưu phẩm nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 600 }}>
            Ghi nhận Bưu phẩm
          </span>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
        centered={false}
        width={600}
        style={{ top: 20, maxWidth: "100vw", paddingBottom: 0 }}
        bodyStyle={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{ marginTop: 24 }}
        >
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
              Thông tin Hàng hóa
            </Typography.Text>
            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  name="type"
                  label="Loại hàng"
                  initialValue="package"
                  style={{ marginBottom: screens.xs ? 12 : 0 }}
                >
                  <Select
                    size="large"
                    options={[
                      { value: "document", label: "📄 Tài liệu / Thư từ" },
                      { value: "package", label: "📦 Hàng hóa / Kiện hàng" },
                      { value: "food", label: "🍔 Đồ ăn / Thức uống" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="sender"
                  label="Người gửi / Shipper"
                  style={{ marginBottom: 0 }}
                >
                  <Input size="large" placeholder="Tên shipper hoặc SĐT" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Typography.Text
            strong
            style={{ display: "block", marginBottom: 12 }}
          >
            Người nhận (Nhân viên)
          </Typography.Text>
          <Row gutter={16}>
            <Col span={24} md={12}>
              <Form.Item
                name="recipient"
                label="Tên nhân viên"
                rules={[{ required: true, message: "Nhập tên người nhận" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="company" label="Công ty">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default DeliveriesPage;
