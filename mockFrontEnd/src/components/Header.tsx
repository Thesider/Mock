import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaCalendarCheck, FaBars, FaTimes } from "react-icons/fa";
import "../assets/Header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserEmail(parsed.email || null);
      } catch {
        setUserEmail(null);
      }
    } else {
      setUserEmail(null);
    }
  }, []);

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
        <button className="book-btn">
          <FaCalendarCheck className="btn-icon" />
          Book an Appointment
        </button>
        {userEmail ? (
          <div className="user-info-wrapper">
            <div
              className="user-info"
              onClick={() => setShowDropdown((prev) => !prev)}
              tabIndex={0}
              style={{ cursor: "pointer" }}
            >
              {userEmail.split("@")[0]}
              <span className="dropdown-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            {showDropdown && (
              <div className="user-dropdown">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/admin")}
                >
                  Admin Management
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className="login-btn">
            <FaSignInAlt className="btn-icon" />
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
