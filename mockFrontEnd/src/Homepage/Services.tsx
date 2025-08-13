import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../assets/Services.css";

const Services: React.FC = () => {
  return (
    <div className="services-container">
      <h1>Services</h1>

      <nav className="services-nav">
        <NavLink
          to="doctors"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          List of doctors
        </NavLink>
        <NavLink
          to="book"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Booking form
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default Services;
