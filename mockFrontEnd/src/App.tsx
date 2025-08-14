import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import Profile from './pages/Profile/Profile';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import CheckIn from './pages/CheckIn/CheckIn';
import MedicalRecords from './pages/MedicalRecords/MedicalRecords';
import Doctor from './pages/Doctor/doctor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="checkin" element={<CheckIn />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="doctors" element={<Doctor />} />
          </Route>
          {/* Add login route or other auth routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
