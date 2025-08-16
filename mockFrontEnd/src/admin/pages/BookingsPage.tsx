import React from "react";
import { Card, Table, Tag } from "antd";
import { recentBookings, statusColors } from "../mockData";

const columns = [
  { title: "Booking ID", dataIndex: "id", key: "id" },
  { title: "Patient", dataIndex: "patient", key: "patient" },
  { title: "Doctor", dataIndex: "doctor", key: "doctor" },
  { title: "Appointment Time", dataIndex: "time", key: "time" },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status: keyof typeof statusColors) => (
      <Tag color={statusColors[status]}>{status}</Tag>
    ),
  },
];

const BookingsPage: React.FC = () => {
  return (
    <Card
      title="Bookings"
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
    >
      <Table
        columns={columns}
        dataSource={recentBookings}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default BookingsPage;
