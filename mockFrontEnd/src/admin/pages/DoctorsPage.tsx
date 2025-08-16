import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Alert } from "antd";
import { getAllDoctors } from "../../api/DoctorApi";
import type { Doctor } from "../../api/DoctorApi";

const statusColors = {
  Online: "green",
  Offline: "red",
  Busy: "orange",
};

const columns: any[] = [
  { title: "Doctor ID", dataIndex: "id", key: "id" },
  { title: "Full Name", dataIndex: "name", key: "name" },
  { title: "Specialty", dataIndex: "specialty", key: "specialty" },
  { title: "Department", dataIndex: "department", key: "department" },
  { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag color={statusColors[status as keyof typeof statusColors] || "default"}>
        {status}
      </Tag>
    ),
  },
];

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllDoctors();
        setDoctors(response.data);
      } catch (err: any) {
        setError('Failed to fetch doctors');
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (error) {
    return (
      <Card title="Doctors" bordered={false}>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card
      title="Doctors"
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
    >
      <Table
        columns={columns}
        dataSource={doctors}
        rowKey={(record: any) => record.id.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default DoctorsPage;
