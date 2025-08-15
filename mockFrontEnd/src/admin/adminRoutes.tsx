import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import BookingsPage from "./pages/BookingsPage";
import DoctorsPage from "./pages/DoctorsPage";
import PatientsPage from "./pages/PatientsPage";
import ReportsPage from "./pages/ReportsPage";

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="bookings" element={<BookingsPage />} />
      <Route path="doctors" element={<DoctorsPage />} />
      <Route path="patients" element={<PatientsPage />} />
      <Route path="reports" element={<ReportsPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
