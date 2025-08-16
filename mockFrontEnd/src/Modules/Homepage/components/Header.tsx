import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <NavLink to="/">
          <img src="/images/logo2.png" alt="Swiftqueue Logo" />
        </NavLink>
      </div>

      <button type="button" className={styles.hamburger} onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </button>

      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.open : ""}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Doctors
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.active : ""}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </NavLink>
      </nav>

      <div className={styles.navButtons}>
        <button type="button" className={styles.loginBtn} onClick={() => navigate("/login")}>
          <span className={styles.btnIcon}>🔑</span> Login
        </button>
        <button type="button" className={styles.bookBtn} onClick={() => navigate("/book-appointment")}>
          <span className={styles.btnIcon}>📅</span> Book an Appointment
        </button>
      </div>
    </header>
  );
};

export default Header;
