import React from "react";
import { NavLink } from "react-router-dom";
import { FaSignInAlt, FaCalendarCheck } from "react-icons/fa";
import "../assets/Header.css";

const Header: React.FC = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src="/images/logo2.png" alt="Swiftqueue Logo" />
        </NavLink>
      </div>

      <nav>
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

        <div className="dropdown">
          <NavLink to="/services" className="nav-link">
            Services
          </NavLink>
          <div className="dropdown-content">
            <NavLink to="/doctors" className="dropdown-item">
              List of doctors
            </NavLink>
            <NavLink to="/book" className="dropdown-item">
              Booking form
            </NavLink>
          </div>
        </div>

        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
        <NavLink to="/contact" className="nav-link">
          Contact
        </NavLink>
      </nav>

      <div className="nav-buttons">
        <button className="login-btn">
          <FaSignInAlt className="btn-icon" />
          Login
        </button>
        <button className="book-btn">
          <FaCalendarCheck className="btn-icon" />
          Book an Appointment
        </button>
      </div>
    </header>
  );
};

export default Header;
