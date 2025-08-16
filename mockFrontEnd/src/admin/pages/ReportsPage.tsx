import React from "react";
import { Card, Row, Col } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { bookingChartData, servicePieData, pieColors } from "../mockData";

const ReportsPage: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={12}>
        <Card
          title="Báo cáo lượt booking"
          bordered={false}
          style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bookingChartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#1890ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card
          title="Cơ cấu dịch vụ"
          bordered={false}
          style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,.09)" }}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={servicePieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
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
  );
};

export default ReportsPage;
