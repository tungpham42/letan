export interface Visitor {
  id: string;
  name: string; // Tên khách
  company: string; // Công ty/Đơn vị
  host: string; // Người tiếp đón
  floor: string; // Tầng
  purpose: string; // Mục đích
  checkInTime: string;
  checkOutTime?: string;
  status: "active" | "completed"; // active: đang ở, completed: đã về
}

export interface DeliveryItem {
  id: string;
  recipient: string; // Người nhận
  company: string; // Công ty
  type: "document" | "package" | "food"; // Loại hàng
  sender: string; // Người gửi/Shipper
  arrivalTime: string;
  pickupTime?: string;
  status: "pending" | "picked_up";
}

export interface Company {
  id: string;
  name: string;
  floor: string;
  room: string;
  hotline: string;
  contactPerson: string;
}
