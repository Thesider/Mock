import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Services: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Services</h1>

      <nav style={{ marginBottom: "20px" }}>
        <NavLink
          to="doctors"
          style={({ isActive }) => ({
            marginRight: "20px",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          List of doctors
        </NavLink>
        <NavLink
          to="book"
          style={({ isActive }) => ({
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Booking form
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default Services;
