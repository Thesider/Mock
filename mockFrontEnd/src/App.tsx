
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import { DoctorPage } from './Modules/Doctor/components';

function App() {
  return (
    <div>
      <nav>
        <Link to="/doctors">Doctors</Link>
      </nav>
      <Routes>
        <Route path="/doctors" element={<DoctorPage />} />
      </Routes>
    </div>
  );
}

export default App;
