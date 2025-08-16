import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logout, removeAuthToken } from '../../api/LoginApi';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await Logout();
      removeAuthToken();
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local storage and redirect
      removeAuthToken();
      navigate('/login');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">❤️</span>
          <span className="logo-text">Patient Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/appointments" className="nav-item">
          <span className="nav-icon">📅</span>
          <span className="nav-text">My Appointments</span>
        </NavLink>

        <NavLink to="/book-appointment" className="nav-item">
          <span className="nav-icon">➕</span>
          <span className="nav-text">Book Appointment</span>
        </NavLink>

        <NavLink to="/checkin" className="nav-item">
          <span className="nav-icon">✅</span>
          <span className="nav-text">Check-in</span>
        </NavLink>

        <NavLink to="/medical-records" className="nav-item">
          <span className="nav-icon">📋</span>
          <span className="nav-text">Medical Records</span>
        </NavLink>

        <NavLink to="/doctors" className="nav-item">
          <span className="nav-icon">👨‍⚕️</span>
          <span className="nav-text">Our Doctors</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profile</span>
        </NavLink>

        <button type="button" onClick={handleSignOut} className="nav-item sign-out" disabled={loggingOut}>
          <span className="nav-icon">🚪</span>
          <span className="nav-text">{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
