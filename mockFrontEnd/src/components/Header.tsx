import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaSignInAlt, FaCalendarCheck, FaBars, FaTimes } from "react-icons/fa";
import "../assets/Header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src="/images/logo2.png" alt="Swiftqueue Logo" />
        </NavLink>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
        <NavLink
          to="/"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </NavLink>

        <div className="dropdown">
          <NavLink
            to="/services"
            className="nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </NavLink>
          <div className="dropdown-content">
            <NavLink
              to="/doctors"
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              List of doctors
            </NavLink>
            <NavLink
              to="/book"
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              Booking form
            </NavLink>
          </div>
        </div>

        <NavLink
          to="/about"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className="nav-link"
          onClick={() => setIsMenuOpen(false)}
        >
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
