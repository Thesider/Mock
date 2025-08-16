import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Alert } from "antd";
import { getAppointments } from "../../api/AppointmentApi";
import type { Appointment } from "../../api/AppointmentApi";

const statusColors = {
  Scheduled: "blue",
  Completed: "green",
  Canceled: "red",
};

const columns: any[] = [
  { title: "Booking ID", dataIndex: "id", key: "id" },
  {
    title: "Patient",
    key: "patient",
    render: (_: any, record: any) => record.patient?.name || `Patient ${record.patientId}`
  },
  {
    title: "Doctor",
    key: "doctor",
    render: (_: any, record: any) => record.doctor?.name || `Doctor ${record.doctorId}`
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date: string) => new Date(date).toLocaleDateString()
  },
  {
    title: "Start Time",
    dataIndex: "startTime",
    key: "startTime",
    render: (time: string) => new Date(time).toLocaleTimeString()
  },
  {
    title: "End Time",
    dataIndex: "endTime",
    key: "endTime",
    render: (time: string) => new Date(time).toLocaleTimeString()
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status: string) => (
      <Tag color={statusColors[status as keyof typeof statusColors] || "default"}>
        {status}
      </Tag>
    ),
  },
  { title: "Description", dataIndex: "description", key: "description" },
  { title: "Location", dataIndex: "location", key: "location" },
];

const BookingsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAppointments();
        setAppointments(response.data);
      } catch (err: any) {
        setError('Failed to fetch appointments');
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (error) {
    return (
      <Card title="Bookings" bordered={false}>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  return (
    <Card
      title="Bookings"
      bordered={false}
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
    >
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey={(record: any) => record.id.toString()}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default BookingsPage;
