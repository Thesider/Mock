import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Homepage/Home";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";
import { DoctorPage } from "./Modules/Doctor/components";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import BookingsPage from "./admin/pages/BookingsPage";
import DoctorsPage from "./admin/pages/DoctorsPage";
import PatientsPage from "./admin/pages/PatientsPage";
import ReportsPage from "./admin/pages/ReportsPage";

function App() {
  return (
    <div>
      {/* <nav>
        <Link to="/doctors">Doctors</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<DoctorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;
