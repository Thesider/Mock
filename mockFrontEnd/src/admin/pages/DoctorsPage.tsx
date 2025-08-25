/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Alert, Select, message, Button, Modal, Tooltip } from "antd";
import { getAllDoctors, editDoctor, deleteDoctor } from "../../api/DoctorApi";
import type { Doctor } from "../../api/DoctorApi";

const statusColors = {
  Online: "green",
  Offline: "red",
  Busy: "orange",
};

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
        setDoctors(response.data || []);
      } catch (err: any) {
        setError("Failed to fetch doctors");
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const updateDoctorStatus = async (id: number, newStatus: string) => {
    try {
      const doc = doctors.find((d) => d.id === id);
      if (!doc) throw new Error("Doctor not found");
      const payload: Doctor = { ...doc, status: newStatus as any };
      await editDoctor(id, payload);
      setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, status: newStatus as any } : d)));
      message.success("Doctor status updated");
    } catch (err) {
      console.error("Failed to update doctor status", err);
      message.error("Failed to update doctor status");
    }
  };

  const handleDeleteDoctor = async (doctor: Doctor) => {
    console.log("handleDeleteDoctor called", doctor.id);

    // Use simple browser confirm to avoid Ant Design modal issues
    const ok = window.confirm(`Delete doctor ${doctor.name}? This action cannot be undone.`);
    if (!ok) return;

    try {
      await deleteDoctor(doctor.id);
      setDoctors(prev => prev.filter(d => d.id !== doctor.id));
      message.success("Doctor deleted");
    } catch (err) {
      console.error("Failed to delete doctor", err);
      message.error("Failed to delete doctor");
    }
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
      render: (status: string, record: any) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(value: string) => updateDoctorStatus(record.id, value)}
          options={[
            { label: "Online", value: "Online" },
            { label: "Offline", value: "Offline" },
            { label: "Busy", value: "Busy" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Doctor) => (
        <div className="actions">
          <Tooltip title="Delete doctor">
            <Button danger size="small" onClick={() => { console.log('Delete doctor clicked', record.id); handleDeleteDoctor(record); }}>
              Delete
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

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
