import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  return (
    <div className={`action-card ${color}`} onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  // Get user name from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.username || parsed.email || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const handleBookAppointment = () => {
    navigate("/book-appointment");
  };

  const handleViewRecords = () => {
    navigate("/medical-records");
  };

  const handleUpdateProfile = () => {
    navigate("/profile");
  };

  const handleCheckIn = () => {
    navigate("/checkin");
  };

  const handleBookFirstAppointment = () => {
    navigate("/book-appointment");
  };

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, {userName}!</h1>
          <p className="welcome-subtitle">
            Manage your healthcare journey from your personal dashboard
          </p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <ActionCard
          icon="+"
          title="Book Appointment"
          description="Schedule a new appointment"
          color="blue"
          onClick={handleBookAppointment}
        />

        <ActionCard
          icon="📋"
          title="View Records"
          description="Access medical records"
          color="green"
          onClick={handleViewRecords}
        />

        <ActionCard
          icon="👤"
          title="Update Profile"
          description="Manage your information"
          color="purple"
          onClick={handleUpdateProfile}
        />

        <ActionCard
          icon="🕐"
          title="Check-in"
          description="Check in for your appointment"
          color="orange"
          onClick={handleCheckIn}
        />
      </div>

      {/* Upcoming Appointments Section */}
      <div className="upcoming-section">
        <div className="section-header">
          <h2 className="section-title">Upcoming Appointments</h2>
          <button type="button" className="view-all-btn">View All</button>
        </div>

        <div className="no-appointments">
          <div className="no-appointments-icon">📅</div>
          <p className="no-appointments-text">No upcoming appointments</p>
          <button
            type="button"
            className="book-first-btn"
            onClick={handleBookFirstAppointment}
          >
            Book Your First Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
