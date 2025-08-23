/* eslint-disable */
// @ts-nocheck
import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Table,
  Tag,
  Calendar,
  Badge,
  Select,
  message,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ScheduleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import styles from "./styles.module.css";
import { getAppointments, updateAppointment, type Appointment } from "../api/AppointmentApi";
import { getAllDoctors, type Doctor as DocType } from "../api/DoctorApi";
import { getAllPatients } from "../api/PatientApi";

const { Title, Text } = Typography;

type DateLike = { format: (fmt: string) => string };

interface BookingItem {
  id: string;
  patient: string;
  doctor: string;
  time: string; // 'YYYY-MM-DD HH:mm'
  status: string;
}

interface SummaryCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const statusColors: Record<string, "success" | "processing" | "default" | "error" | "warning"> = {
  Scheduled: "warning",
  Completed: "success",
  Canceled: "error",
};

const statusTagColors: Record<string, string> = {
  Scheduled: "gold",
  Completed: "green",
  Canceled: "red",
};

const pieColors = ["#1890ff", "#52c41a", "#faad14", "#722ed1", "#ff4d4f"];

const Dashboard: React.FC = () => {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [doctors, setDoctors] = React.useState<DocType[]>([]);
  const [patients, setPatients] = React.useState<any[]>([]);
  const [patientsCount, setPatientsCount] = React.useState<number>(0);
  const [selectedDate, setSelectedDate] = React.useState<DateLike | null>(null);

  React.useEffect(() => {
    // fetch appointments, doctors, patients count
    const load = async () => {
      try {
        const apptRes = await getAppointments();
        const appts = apptRes.data || [];
        setAppointments(appts);
      } catch (e) {
        console.error("Failed to load appointments", e);
      }

      try {
        const docRes = await getAllDoctors();
        setDoctors(docRes.data || []);
      } catch (e) {
        console.error("Failed to load doctors", e);
      }

      try {
        const patRes = await getAllPatients();
        const pats = (patRes as any).data || [];
        setPatients(pats || []);
        setPatientsCount(pats.length || 0);
      } catch (e) {
        console.error("Failed to load patients", e);
      }
    };

    load();
  }, []);

  const statusOptions = [
    { label: "Scheduled", value: 0 },
    { label: "Completed", value: 1 },
    { label: "Canceled", value: 2 },
  ];

  const getStatusNumber = (s: string) => (s === "Completed" ? 1 : s === "Canceled" ? 2 : 0);
  const getStatusString = (n: number) => (n === 1 ? "Completed" : n === 2 ? "Canceled" : "Scheduled");

  const updateAppointmentStatus = async (id: number, newStatusNumber: number) => {
    try {
      const appt = appointments.find((a) => a.id === id);
      if (!appt) throw new Error("Appointment not found");
      const payload = {
        id: appt.id,
        patientId: appt.patientId,
        date: appt.date,
        startTime: appt.startTime,
        endTime: appt.endTime,
        description: appt.description,
        location: appt.location,
        status: newStatusNumber,
        doctorId: appt.doctorId,
      };
      await updateAppointment(id, payload);
      setAppointments((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: getStatusString(newStatusNumber) } : p))
      );
      message.success("Appointment status updated");
    } catch (e) {
      console.error(e);
      message.error("Failed to update status");
    }
  };

  // Summary cards derived from live data
  const summaryCards: SummaryCard[] = [
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: <ScheduleOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    },
    {
      title: "Completed Appointments",
      value: appointments.filter((a) => a.status === "Completed").length,
      icon: <CheckCircleOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
    },
    {
      title: "Scheduled Appointments",
      value: appointments.filter((a) => a.status === "Scheduled").length,
      icon: <UserOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
    },
    {
      title: "Total Patients",
      value: patientsCount,
      icon: <TeamOutlined style={{ fontSize: "32px", color: "#13c2c2" }} />,
    },
  ];

  // Booking chart: bookings per day for last 7 days
  const getLast7Days = () => {
    const days: { label: string; key: string }[] = [];
    const names = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const label = names[d.getDay()];
      days.push({ label, key });
    }
    return days;
  };

  const bookingChartData = React.useMemo(() => {
    const days = getLast7Days();
    return days.map((day) => ({
      day: day.label,
      bookings: appointments.filter((a) => a.date === day.key).length,
    }));
  }, [appointments]);

  // Service pie chart -> use doctor specialties distribution
  const servicePieData = React.useMemo(() => {
    const map = new Map<string, number>();
    doctors.forEach((d) => {
      const k = d.specialty || "Other";
      map.set(k, (map.get(k) || 0) + 1);
    });
    const arr = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    return arr.length ? arr : [{ name: "No data", value: 1 }];
  }, [doctors]);

  // Recent bookings table
  const recentBookings: BookingItem[] = React.useMemo(() => {
    // sort by date desc + startTime desc
    const sorted = [...appointments].sort((a, b) => {
      const da = `${a.date} ${a.startTime}`;
      const db = `${b.date} ${b.startTime}`;
      return db.localeCompare(da);
    });
    return sorted.slice(0, 10).map((a) => {
      const patientName =
        a.patient?.name || (patients.find((p) => p.id === a.patientId)?.name) || a.patientName || "Unknown patient";
      const doctorName =
        a.doctor?.name || (doctors.find((d) => d.id === a.doctorId)?.name) || a.doctorName || "Unknown doctor";
      return {
        id: String(a.id),
        patient: patientName,
        doctor: doctorName,
        time: `${a.date} ${a.startTime}`,
        status: a.status,
      };
    });
  }, [appointments]);

  // calendar bookings grouped by date
  const calendarBookings: Record<string, BookingItem[]> = React.useMemo(() => {
    const map: Record<string, BookingItem[]> = {};
    appointments.forEach((a) => {
      const key = a.date;
      const patientName =
        a.patient?.name || (patients.find((p) => p.id === a.patientId)?.name) || a.patientName || "Unknown patient";
      const doctorName =
        a.doctor?.name || (doctors.find((d) => d.id === a.doctorId)?.name) || a.doctorName || "Unknown doctor";
      const item: BookingItem = {
        id: String(a.id),
        patient: patientName,
        doctor: doctorName,
        time: `${a.date} ${a.startTime}`,
        status: a.status,
      };
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [appointments]);

  const recentBookingColumns: any[] = [
    { title: "ID Booking", dataIndex: "id", key: "id" },
    { title: "Tên bệnh nhân", dataIndex: "patient", key: "patient" },
    { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
    { title: "Thời gian hẹn", dataIndex: "time", key: "time" },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (_: string, record: any) => {
        const id = Number(record.id);
        const appt = appointments.find((a) => a.id === id);
        const currentStatus = appt?.status || record.status;
        return (
          <Select
            value={currentStatus}
            onChange={(value: string) => {
              const num = getStatusNumber(value);
              updateAppointmentStatus(id, num);
            }}
            style={{ width: 140 }}
            options={[
              { label: "Scheduled", value: "Scheduled" },
              { label: "Completed", value: "Completed" },
              { label: "Canceled", value: "Canceled" },
            ]}
          />
        );
      },
    },
  ];

  const getListData = (value: DateLike): BookingItem[] => {
    const key = value.format("YYYY-MM-DD");
    return calendarBookings[key] || [];
  };

  const dateCellRender = (value: DateLike) => {
    const listData = getListData(value);
    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {listData.map((item) => (
          <li key={item.id}>
            <Badge status={statusColors[item.status]} text={item.patient} />
          </li>
        ))}
      </ul>
    );
  };

  const handleSelect = (date: unknown) => {
    const d = date as DateLike;
    setSelectedDate(d);
  };

  return (
    <div>
      <Title level={3} className={styles.pageTitle}>
        System Overview
      </Title>
      <div>
        <Row gutter={[24, 24]}>
          {/* Summary Cards */}
          {summaryCards.map((card) => (
            <Col xs={24} sm={12} md={6} key={card.title}>
              <Card bordered={false} className={styles.card}>
                <Space direction="vertical" size="middle">
                  {card.icon}
                  <Text strong>{card.title}</Text>
                  <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
                    {card.value}
                  </Title>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[24, 24]} className={styles.section}>
          {/* Booking Chart */}
          <Col xs={24} md={12}>
            <Card
              title="Bookings in last 7 days"
              bordered={false}
              className={styles.card}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bookingChartData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#1890ff"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          {/* Service Pie Chart (doctor specialties) */}
          <Col xs={24} md={12}>
            <Card
              title="Doctor specialties"
              bordered={false}
              className={styles.card}
            >
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={servicePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {servicePieData.map((_, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]} className={styles.section}>
          {/* Recent Bookings Table */}
          <Col xs={24} md={14}>
            <Card
              title="Recent bookings"
              bordered={false}
              className={styles.card}
            >
              <Table
                columns={recentBookingColumns}
                dataSource={recentBookings}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </Col>
          {/* Calendar View */}
          <Col xs={24} md={10}>
            <Card title="Calendar" bordered={false} className={styles.card}>
              <Calendar
                className="dashboard-calendar"
                dateCellRender={dateCellRender}
                onSelect={handleSelect}
              />
              {selectedDate && (
                <div className={styles.subSection}>
                  <Title level={5} style={{ color: "#1890ff" }}>
                    Appointments on {selectedDate.format("DD/MM/YYYY")}
                  </Title>
                  <Divider className={styles.dividerCompact} />
                  {getListData(selectedDate).length > 0 ? (
                    getListData(selectedDate).map((b) => (
                      <div key={b.id} className={styles.listItem}>
                        <Text strong>{b.patient}</Text> with{" "}
                        <Text strong>{b.doctor}</Text> at{" "}
                        <Text strong>{b.time.split(" ")[1]}</Text> -{" "}
                        <Tag color={statusTagColors[b.status]}>{b.status}</Tag>
                      </div>
                    ))
                  ) : (
                    <Text type="secondary">No appointments.</Text>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
