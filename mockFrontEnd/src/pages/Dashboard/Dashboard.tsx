import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { getAppointments } from "../../api/AppointmentApi";
import type { Appointment } from "../../api/AppointmentApi";

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

const UpcomingAppointments: React.FC<{ onBookFirst: () => void }> = ({ onBookFirst }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getAppointments();
        setAppointments(res.data || []);
      } catch (e) {
        console.error("Failed to load appointments", e);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getCurrentPatientId = (): number => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload?.patientId) {
            const n = Number(payload.patientId);
            if (!isNaN(n) && n > 0) return n;
          }
        }
      } catch { }
    }

    const pid = localStorage.getItem("patientId");
    if (pid) {
      const n = Number(pid);
      if (!isNaN(n) && n > 0) return n;
    }

    const userStorage = localStorage.getItem("user");
    if (userStorage) {
      try {
        const parsed = JSON.parse(userStorage);
        if (parsed?.patientId) {
          const n = Number(parsed.patientId);
          if (!isNaN(n) && n > 0) return n;
        }
      } catch { }
    }

    const patientStorage = localStorage.getItem("patient");
    if (patientStorage) {
      try {
        const parsedP = JSON.parse(patientStorage);
        if (parsedP?.id) {
          const n = Number(parsedP.id);
          if (!isNaN(n) && n > 0) return n;
        }
      } catch { }
    }

    return 0;
  };

  const patientId = getCurrentPatientId();
  const userAppointments = appointments
    .filter((a) => a.patientId === patientId)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const now = new Date();
  const next = userAppointments.find((a) => new Date(a.startTime) > now);

  if (loading) {
    return <div className="no-appointments">Loading...</div>;
  }

  if (!next) {
    return (
      <div className="no-appointments">
        <div className="no-appointments-icon">📅</div>
        <p className="no-appointments-text">No upcoming appointments</p>
        <button type="button" className="book-first-btn" onClick={onBookFirst}>
          Book Your First Appointment
        </button>
      </div>
    );
  }

  const start = new Date(next.startTime).toLocaleString();

  return (
    <div className="upcoming-card">
      <div className="upcoming-left">
        <div className="upcoming-doctor">{next.doctor?.name ?? "Doctor"}</div>
        <div className="upcoming-info">When: {start}</div>
        <div className="upcoming-location">Location: {next.location ?? "TBD"}</div>
        <div className="upcoming-id">Appointment ID: {next.id}</div>
      </div>
      <div className="upcoming-actions">
        <p className="upcoming-note">
          You'll receive an email and SMS reminder. Please arrive 10 minutes early and bring your appointment ID.
        </p>
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

        <UpcomingAppointments
          onBookFirst={handleBookFirstAppointment}
        />
      </div>
    </div>
  );
};

export default Dashboard;
