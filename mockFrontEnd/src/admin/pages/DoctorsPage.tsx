import React from "react";
import { Card, Table, Tag } from "antd";
import { mockDoctors } from "../mockData";

const columns = [
  { title: "Doctor ID", dataIndex: "id", key: "id" },
  { title: "Full Name", dataIndex: "name", key: "name" },
  { title: "Specialty", dataIndex: "specialty", key: "specialty" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (s: string) => (
      <Tag color={s === "Đang làm việc" ? "processing" : "warning"}>{s}</Tag>
    ),
  },
];

const DoctorsPage: React.FC = () => {
  return (
    <Card
      title="Doctors"
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
    >
      <Table
        columns={columns}
        dataSource={mockDoctors}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default DoctorsPage;
