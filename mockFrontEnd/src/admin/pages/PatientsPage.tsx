import React from "react";
import { Card, Table } from "antd";
import { mockPatients } from "../mockData";

const columns = [
  { title: "Patient ID", dataIndex: "id", key: "id" },
  { title: "Full Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Last Visit", dataIndex: "lastVisit", key: "lastVisit" },
];

const PatientsPage: React.FC = () => {
  return (
    <Card
      title="Patients"
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
    >
      <Table
        columns={columns}
        dataSource={mockPatients}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default PatientsPage;
