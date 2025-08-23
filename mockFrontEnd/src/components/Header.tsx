import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaCalendarCheck, FaBars, FaTimes } from "react-icons/fa";
import { Logout, removeAuthToken } from "../api/LoginApi";
import "../assets/Header.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null); // ref cho dropdown

  const checkUserAuth = useCallback(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserEmail(parsed.username || parsed.email || null);
        setUserRole(parsed.role || null);
      } catch {
        setUserEmail(null);
        setUserRole(null);
      }
    } else {
      setUserEmail(null);
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    checkUserAuth();

    const handleStorageChange = () => checkUserAuth();
    const handleAuthEvent = () => checkUserAuth();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userLoggedIn", handleAuthEvent);
    window.addEventListener("userLoggedOut", handleAuthEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoggedIn", handleAuthEvent);
      window.removeEventListener("userLoggedOut", handleAuthEvent);
    };
  }, [checkUserAuth]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await Logout();
      removeAuthToken();
      setUserEmail(null);
      setShowProfileDropdown(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      removeAuthToken();
      setUserEmail(null);
      setShowProfileDropdown(false);
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/">
          <img src="/images/logo2.png" alt="Swiftqueue Logo" />
        </NavLink>
      </div>

      <button type="button" className="hamburger" onClick={toggleMenu}>
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

        {/* Services (hover mở) */}
        <div className="dropdown-service">
          <button type="button" className="nav-link dropdown-toggle">
            Services
          </button>
          <div className="dropdown-content">
            <NavLink
              to="/doctors"
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              List of doctors
            </NavLink>
            <NavLink
              to="/book-appointment"
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
        <button
          type="button"
          className="book-btn"
          onClick={() => navigate("/book-appointment")}
        >
          <FaCalendarCheck className="btn-icon" />
          Book an Appointment
        </button>
        {userEmail ? (
          <div className="user-info-wrapper" ref={dropdownRef}>
            <div
              className="user-info"
              onClick={() => setShowProfileDropdown((prev) => !prev)}
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
            {showProfileDropdown && (
              <div className="user-dropdown">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                {userRole === "Admin" && (
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => navigate("/admin")}
                  >
                    Admin Management
                  </button>
                )}
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="login-btn"
          >
            <FaSignInAlt className="btn-icon" />
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
