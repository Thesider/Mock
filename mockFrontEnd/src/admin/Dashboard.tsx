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
  DollarCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  summaryData as summaryDataMock,
  bookingChartData,
  recentBookings,
  servicePieData,
  pieColors,
  calendarBookings,
  statusColors,
} from "./mockData";
import type { BookingItem } from "./mockData";
import styles from "./styles.module.css";

const { Title, Text } = Typography;

type DateLike = { format: (fmt: string) => string };

interface SummaryCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const summaryCards: SummaryCard[] = summaryDataMock.map((item, index) => {
  const icons: React.ReactNode[] = [
    <ScheduleOutlined style={{ fontSize: "32px", color: "#1890ff" }} />,
    <CheckCircleOutlined style={{ fontSize: "32px", color: "#52c41a" }} />,
    <DollarCircleOutlined style={{ fontSize: "32px", color: "#faad14" }} />,
    <UserAddOutlined style={{ fontSize: "32px", color: "#13c2c2" }} />,
  ];
  return { ...item, icon: icons[index] } as SummaryCard;
});

const recentBookingColumns = [
  { title: "ID Booking", dataIndex: "id", key: "id" },
  { title: "Tên bệnh nhân", dataIndex: "patient", key: "patient" },
  { title: "Bác sĩ", dataIndex: "doctor", key: "doctor" },
  { title: "Thời gian hẹn", dataIndex: "time", key: "time" },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "status",
    render: (status: BookingItem["status"]) => (
      <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
    ),
  },
];

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<DateLike | null>(null);

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
          {/* Service Pie Chart */}
          <Col xs={24} md={12}>
            <Card
              title="Service categories"
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
                        <Tag color={statusColors[b.status]}>{b.status}</Tag>
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
