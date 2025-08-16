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
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
// User Dashboard Components
import UserDashboard from "./pages/Dashboard/Dashboard";
import MyAppointments from "./pages/MyAppointments/MyAppointments";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import MedicalRecords from "./pages/MedicalRecords/MedicalRecords";
import Profile from "./pages/Profile/Profile";

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
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medical-records"
          element={
            <ProtectedRoute>
              <MedicalRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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
