import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import Profile from './pages/Profile/Profile';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import CheckIn from './pages/CheckIn/CheckIn';
import MedicalRecords from './pages/MedicalRecords/MedicalRecords';
import Home from "./Homepage/Home";
import About from "./Homepage/About";
import Contact from "./Homepage/Contact";
import { DoctorPage } from './Modules/Doctor/components';

function App() {

  return (
    <div>
      <nav>
        <Link to="/doctors">Doctors</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<DoctorPage />} />
      </Routes>
    </div>
  );
}
export default App;
